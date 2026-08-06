import os
import sys
import pandas as pd
import numpy as np

# Ensure workspace root is in sys.path to import src.predictor
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

from src.predictor import InventoryPredictor


def clean_percentage(val):
    """Converts percentage string (e.g. '0,88%') or numerical string to float decimal."""
    if isinstance(val, (int, float)):
        return float(val)
    if pd.isna(val) or val is None:
        return 0.0
    s = str(val).strip().rstrip('%').replace(',', '.')
    try:
        # Convert e.g. 0.88 to 0.0088
        return round(float(s) / 100.0, 6)
    except ValueError:
        return 0.0


class DataLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataLoader, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self.csv_path = os.path.join(workspace_root, "data", "processed", "rekomendasi_stok_abc_final.csv")
        self.model_path = os.path.join(workspace_root, "models", "catboost_model_800.cbm")
        
        # Singleton loading of InventoryPredictor
        try:
            self.predictor = InventoryPredictor(model_path=self.model_path)
        except Exception as e:
            print(f"Warning: Could not load CatBoost model file directly: {e}")
            self.predictor = None

        # Load processed recommendation CSV
        if os.path.exists(self.csv_path):
            df = pd.read_csv(self.csv_path)
            df['StockCode'] = df['StockCode'].astype(str)
            
            # Clean percentage fields to float decimal
            if 'Kontribusi_%' in df.columns:
                df['Kontribusi_Decimal'] = df['Kontribusi_%'].apply(clean_percentage)
            else:
                df['Kontribusi_Decimal'] = 0.0

            if 'Kumulatif_%' in df.columns:
                df['Kumulatif_Decimal'] = df['Kumulatif_%'].apply(clean_percentage)
            else:
                df['Kumulatif_Decimal'] = 0.0

            self.df = df
        else:
            self.df = pd.DataFrame()

        self._initialized = True

    def get_kpis(self):
        if self.df.empty:
            return {
                "total_demand_7d": 0,
                "total_safety_stock": 0,
                "total_sku": 0,
                "sku_kelas_a": 0,
                "sku_kelas_b": 0,
                "sku_kelas_c": 0
            }

        total_demand = int(self.df['Prediksi_Demand_AI_7Hari'].sum())
        total_safety = int(self.df['Safety_Stock_Rekomendasi'].sum())
        total_sku = int(len(self.df))

        sku_a = int(self.df['Kategori_ABC'].str.contains('Kelas A', na=False).sum())
        sku_b = int(self.df['Kategori_ABC'].str.contains('Kelas B', na=False).sum())
        sku_c = int(self.df['Kategori_ABC'].str.contains('Kelas C', na=False).sum())

        return {
            "total_demand_7d": total_demand,
            "total_safety_stock": total_safety,
            "total_sku": total_sku,
            "sku_kelas_a": sku_a,
            "sku_kelas_b": sku_b,
            "sku_kelas_c": sku_c
        }

    def get_metrics(self):
        mae_val = float(self.predictor.mae) if self.predictor and hasattr(self.predictor, 'mae') else 86.41
        return {
            "model_name": "CatBoost Regressor (800 Iterations)",
            "mae": mae_val,
            "r2": 0.4553,
            "r2_percentage": "45.53%",
            "rmse": 206.56
        }

    def get_abc_distribution(self):
        if self.df.empty:
            return {"distribution": [], "pareto": []}

        # Category aggregation
        grouped = self.df.groupby('Kategori_ABC').agg(
            sku_count=('StockCode', 'count'),
            total_demand=('Prediksi_Demand_AI_7Hari', 'sum'),
            total_safety_stock=('Safety_Stock_Rekomendasi', 'sum')
        ).reset_index()

        total_demand_all = self.df['Prediksi_Demand_AI_7Hari'].sum()
        total_sku_all = len(self.df)

        distribution = []
        for _, row in grouped.iterrows():
            demand_pct = (row['total_demand'] / total_demand_all * 100) if total_demand_all > 0 else 0
            sku_pct = (row['sku_count'] / total_sku_all * 100) if total_sku_all > 0 else 0
            distribution.append({
                "category": row['Kategori_ABC'],
                "sku_count": int(row['sku_count']),
                "total_demand": int(row['total_demand']),
                "total_safety_stock": int(row['total_safety_stock']),
                "percentage_sku": round(sku_pct, 2),
                "percentage_demand": round(demand_pct, 2)
            })

        # Top 40 SKU Pareto curve dataset
        df_pareto = self.df.sort_values(by='Prediksi_Demand_AI_7Hari', ascending=False).head(40)
        pareto = []
        for _, row in df_pareto.iterrows():
            pareto.append({
                "stock_code": str(row['StockCode']),
                "demand": int(row['Prediksi_Demand_AI_7Hari']),
                "kontribusi_pct": float(row['Kontribusi_Decimal']),
                "kumulatif_pct": float(row['Kumulatif_Decimal']),
                "kategori_abc": str(row['Kategori_ABC']),
                "safety_stock": int(row['Safety_Stock_Rekomendasi']),
                "total_stok_gudang": int(row['Rekomendasi_Total_Stok_Gudang'])
            })

        return {
            "distribution": distribution,
            "pareto": pareto
        }

    def get_recommendations(self, search="", kategori_abc="", page=1, limit=10):
        if self.df.empty:
            return {"items": [], "total": 0, "page": page, "limit": limit, "total_pages": 0}

        df_filtered = self.df.copy()

        if search:
            search_str = str(search).strip().lower()
            df_filtered = df_filtered[df_filtered['StockCode'].str.lower().str.contains(search_str, na=False)]

        if kategori_abc and kategori_abc != "Semua":
            df_filtered = df_filtered[df_filtered['Kategori_ABC'].str.contains(kategori_abc, case=False, na=False)]

        total_items = len(df_filtered)
        limit = max(1, limit)
        page = max(1, page)
        total_pages = int(np.ceil(total_items / limit)) if total_items > 0 else 0

        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        df_page = df_filtered.iloc[start_idx:end_idx]

        items = []
        for _, row in df_page.iterrows():
            items.append({
                "stock_code": str(row['StockCode']),
                "prediksi_demand_7d": int(row['Prediksi_Demand_AI_7Hari']),
                "kontribusi_pct": float(row['Kontribusi_Decimal']),
                "kumulatif_pct": float(row['Kumulatif_Decimal']),
                "kategori_abc": str(row['Kategori_ABC']),
                "safety_stock": int(row['Safety_Stock_Rekomendasi']),
                "rekomendasi_total_stok": int(row['Rekomendasi_Total_Stok_Gudang'])
            })

        return {
            "items": items,
            "total": total_items,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }
