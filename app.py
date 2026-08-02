import streamlit as st
import pandas as pd
import os

st.set_page_config(page_title="AI Demand & Inventory Planner", layout="wide")

st.title("📦 AI Inventory Planning Dashboard")
st.write("Sistem Rekomendasi Stok Gudang Berbasis CatBoost & Analisis ABC Pareto")

# Path file hasil akhir
file_path = "data/processed/rekomendasi_stok_abc_final.csv"

if os.path.exists(file_path):
    df_result = pd.read_csv(file_path)

    # Tampilkan KPI Ringkas
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Proyeksi Demand (7 Hari)", f"{df_result['Prediksi_Demand_AI_7Hari'].sum():,} unit")
    col2.metric("Produk Kelas A (Fast-Moving)", f"{(df_result['Kategori_ABC'] == 'Kelas A (Fast-Moving)').sum()} SKU")
    col3.metric("Total Safety Stock", f"{df_result['Safety_Stock_Rekomendasi'].sum():,} unit")

    st.markdown("---")
    st.subheader("📋 Tabel Rekomendasi Stok Gudang")

    # Filter Kategori
    kategori = st.multiselect(
        "Filter Kategori ABC:",
        options=df_result['Kategori_ABC'].unique(),
        default=df_result['Kategori_ABC'].unique()
    )

    df_filtered = df_result[df_result['Kategori_ABC'].isin(kategori)]
    st.dataframe(df_filtered, use_container_width=True)

    # Tombol Download CSV
    csv_data = df_filtered.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Unduh Rekomendasi Stok (CSV)",
        data=csv_data,
        file_name="rekomendasi_stok_abc_final.csv",
        mime="text/csv"
    )
else:
    st.warning("File hasil rekomendasi belum ditemukan di folder `data/processed/`.")