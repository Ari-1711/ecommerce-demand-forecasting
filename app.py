import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os

# 1. Konfigurasi Halaman
st.set_page_config(
    page_title="AI Demand & Inventory Planner",
    page_icon="📦",
    layout="wide"
)

st.title("📦 AI Inventory Planning Dashboard")
st.caption("Sistem Rekomendasi Stok Gudang Berbasis CatBoost Regressor & Analisis ABC Pareto")

# Path file hasil akhir
file_path = "data/processed/rekomendasi_stok_abc_final.csv"

if os.path.exists(file_path):
    # Load Data
    df_result = pd.read_csv(file_path)
    
    # Preprocessing ringan untuk chart (memastikan tipe data string untuk StockCode)
    df_result['StockCode'] = df_result['StockCode'].astype(str)

    # ---------------------------------------------------------
    # SECTION 1: Key Performance Indicators (KPI Cards)
    # ---------------------------------------------------------
    total_demand = df_result['Prediksi_Demand_AI_7Hari'].sum()
    total_safety = df_result['Safety_Stock_Rekomendasi'].sum()
    total_sku_a = (df_result['Kategori_ABC'].str.contains('Kelas A')).sum()

    col1, col2, col3 = st.columns(3)
    col1.metric("Total Proyeksi Demand (7 Hari)", f"{total_demand:,} unit")
    col2.metric("Produk Kelas A (Fast-Moving)", f"{total_sku_a:,} SKU")
    col3.metric("Total Safety Stock", f"{total_safety:,} unit")

    st.markdown("---")

    # ---------------------------------------------------------
    # SECTION 2: Interactive Charts (2x2 Grid)
    # ---------------------------------------------------------
    st.subheader("📊 Visualisasi & Analisis Persediaan")

    # BARIS 1: Chart 1 & Chart 2
    c1, c2 = st.columns(2)

    with c1:
        st.markdown("##### 1. Distribusi SKU per Kategori ABC")
        df_pie = df_result.groupby('Kategori_ABC')['StockCode'].count().reset_index()
        df_pie.columns = ['Kategori_ABC', 'Jumlah_SKU']
        
        fig_donut = px.pie(
            df_pie, 
            values='Jumlah_SKU', 
            names='Kategori_ABC', 
            hole=0.4,
            color='Kategori_ABC',
            color_discrete_map={
                'Kelas A (Fast-Moving)': '#2ca02c',
                'Kelas B (Medium-Moving)': '#ff7f0e',
                'Kelas C (Slow-Moving)': '#d62728'
            }
        )
        fig_donut.update_traces(textposition='inside', textinfo='percent+label')
        fig_donut.update_layout(showlegend=False, height=380, margin=dict(t=20, b=20, l=20, r=20))
        st.plotly_chart(fig_donut, use_container_width=True)

    with c2:
        st.markdown("##### 2. Top 10 SKU Permintaan Teratas")
        df_top10 = df_result.sort_values(by='Prediksi_Demand_AI_7Hari', ascending=False).head(10)
        df_top10 = df_top10.sort_values(by='Prediksi_Demand_AI_7Hari', ascending=True) # Urutkan agar nilai terbesar di atas pada bar chart
        
        fig_top10 = px.bar(
            df_top10,
            x='Prediksi_Demand_AI_7Hari',
            y='StockCode',
            orientation='h',
            color='Kategori_ABC',
            text='Prediksi_Demand_AI_7Hari',
            labels={'Prediksi_Demand_AI_7Hari': 'Prediksi Demand (Unit)', 'StockCode': 'Stock Code'},
            color_discrete_map={
                'Kelas A (Fast-Moving)': '#2ca02c',
                'Kelas B (Medium-Moving)': '#ff7f0e',
                'Kelas C (Slow-Moving)': '#d62728'
            }
        )
        fig_top10.update_traces(texttemplate='%{text}', textposition='outside')
        fig_top10.update_layout(height=380, margin=dict(t=20, b=20, l=20, r=20), legend_title_text='Kategori')
        st.plotly_chart(fig_top10, use_container_width=True)

    # BARIS 2: Chart 3 & Chart 4
    c3, c4 = st.columns(2)

    with c3:
        st.markdown("##### 3. Demand vs Safety Stock per Kelas")
        df_group = df_result.groupby('Kategori_ABC')[['Prediksi_Demand_AI_7Hari', 'Safety_Stock_Rekomendasi']].sum().reset_index()
        
        fig_compare = go.Figure(data=[
            go.Bar(name='Prediksi Demand', x=df_group['Kategori_ABC'], y=df_group['Prediksi_Demand_AI_7Hari'], marker_color='#1f77b4'),
            go.Bar(name='Safety Stock', x=df_group['Kategori_ABC'], y=df_group['Safety_Stock_Rekomendasi'], marker_color='#aec7e8')
        ])
        fig_compare.update_layout(
            barmode='group',
            height=380,
            margin=dict(t=20, b=20, l=20, r=20),
            yaxis_title="Jumlah Unit",
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        st.plotly_chart(fig_compare, use_container_width=True)

    with c4:
        st.markdown("##### 4. Kurva Kumulatif Pareto (Hukum 80/20)")
        df_pareto = df_result.sort_values(by='Prediksi_Demand_AI_7Hari', ascending=False).reset_index(drop=True)
        total_vol = df_pareto['Prediksi_Demand_AI_7Hari'].sum()
        df_pareto['Kontribusi_%'] = (df_pareto['Prediksi_Demand_AI_7Hari'] / total_vol) * 100
        df_pareto['Kumulatif_%'] = df_pareto['Kontribusi_%'].cumsum()

        fig_pareto = make_subplots(specs=[[{"secondary_y": True}]])
        
        # Sumbu Y Kiri: Bar Demand
        fig_pareto.add_trace(
            go.Bar(x=df_pareto['StockCode'].head(30), y=df_pareto['Prediksi_Demand_AI_7Hari'].head(30), name="Demand (Unit)", marker_color='#2ca02c'),
            secondary_y=False,
        )
        # Sumbu Y Kanan: Line Kumulatif %
        fig_pareto.add_trace(
            go.Scatter(x=df_pareto['StockCode'].head(30), y=df_pareto['Kumulatif_%'].head(30), name="Kumulatif %", mode="lines+markers", line=dict(color='#d62728', width=2)),
            secondary_y=True,
        )
        
        fig_pareto.update_layout(
            height=380,
            margin=dict(t=20, b=20, l=20, r=20),
            showlegend=False,
            xaxis_title="Top 30 SKU"
        )
        fig_pareto.update_yaxes(title_text="Demand Unit", secondary_y=False)
        fig_pareto.update_yaxes(title_text="Kumulatif %", range=[0, 105], secondary_y=True)
        st.plotly_chart(fig_pareto, use_container_width=True)

    st.markdown("---")

    # ---------------------------------------------------------
    # SECTION 3: Filter & Data Table
    # ---------------------------------------------------------
    st.subheader("📋 Tabel Detail Rekomendasi Stok Gudang")

    # Filter Kategori Multi-select
    kategori = st.multiselect(
        "Filter berdasarkan Kategori ABC:",
        options=df_result['Kategori_ABC'].unique(),
        default=df_result['Kategori_ABC'].unique()
    )

    df_filtered = df_result[df_result['Kategori_ABC'].isin(kategori)]
    st.dataframe(df_filtered, use_container_width=True)

    # Tombol Unduh CSV
    csv_data = df_filtered.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Unduh Rekomendasi Stok (CSV)",
        data=csv_data,
        file_name="rekomendasi_stok_abc_final.csv",
        mime="text/csv"
    )

else:
    st.warning("File hasil rekomendasi belum ditemukan di folder `data/processed/rekomendasi_stok_abc_final.csv`.")