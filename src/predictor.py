import numpy as np
import pandas as pd
from catboost import CatBoostRegressor

class InventoryPredictor:
    def __init__(self, model_path="models/catboost_model_800.cbm"):
        self.model = CatBoostRegressor()
        self.model.load_model(model_path)
        self.mae = 86.41

    def generate_recommendation(self, df_input, X_test_cat, is_test_mask):
        # 1. Prediksi skala log dan konversi ke skala riil
        prediksi_log = self.model.predict(X_test_cat)
        prediksi_riil = np.expm1(prediksi_log).clip(min=0)

        # 2. Ambil StockCode data uji
        stock_codes = df_input.loc[is_test_mask, 'StockCode'].astype(str).to_numpy()

        df_mentah = pd.DataFrame({
            'StockCode': stock_codes,
            'Prediksi_Demand_AI_7Hari': prediksi_riil
        })

        # 3. Agregasi per produk & urutkan Pareto
        df_abc = df_mentah.groupby('StockCode', as_index=False)['Prediksi_Demand_AI_7Hari'].sum()
        df_abc = df_abc.sort_values(by='Prediksi_Demand_AI_7Hari', ascending=False).reset_index(drop=True)

        # 4. Hitung persentase kumulatif
        total_volume = df_abc['Prediksi_Demand_AI_7Hari'].sum()
        df_abc['Kumulatif_Desimal'] = (df_abc['Prediksi_Demand_AI_7Hari'] / total_volume).cumsum()

        # 5. Klasifikasi ABC & Safety Stock
        def klasifikasi(row):
            if row['Kumulatif_Desimal'] <= 0.70:
                return pd.Series(['Kelas A (Fast-Moving)', round(self.mae * 3, 2)])
            elif row['Kumulatif_Desimal'] <= 0.90:
                return pd.Series(['Kelas B (Medium-Moving)', round(self.mae, 2)])
            else:
                return pd.Series(['Kelas C (Slow-Moving)', 5.0])

        df_abc[['Kategori_ABC', 'Safety_Stock_Rekomendasi']] = df_abc.apply(klasifikasi, axis=1)

        # 6. Total rekomendasi stok
        df_abc['Rekomendasi_Total_Stok_Gudang'] = df_abc['Prediksi_Demand_AI_7Hari'] + df_abc['Safety_Stock_Rekomendasi']

        # Pembulatan unit fisik
        df_abc['Prediksi_Demand_AI_7Hari'] = np.ceil(df_abc['Prediksi_Demand_AI_7Hari']).astype(int)
        df_abc['Safety_Stock_Rekomendasi'] = np.ceil(df_abc['Safety_Stock_Rekomendasi']).astype(int)
        df_abc['Rekomendasi_Total_Stok_Gudang'] = np.ceil(df_abc['Rekomendasi_Total_Stok_Gudang']).astype(int)

        return df_abc.drop(columns=['Kumulatif_Desimal'])