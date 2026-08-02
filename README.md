# 📦 E-Commerce Demand Forecasting & Dynamic Safety Stock System

Sistem prediksi permintaan barang (*demand forecasting*) 7 hari ke depan pada tingkat SKU e-commerce berbasis **CatBoost Regressor** yang terintegrasi dengan **Analisis ABC Pareto** dan alokasi **Dynamic Safety Stock**.

---

## 📌 Problem & Business Context
Manajemen persediaan gudang pada bisnis e-commerce sering mengalami masalah *overstock* atau *stockout* akibat fluktuasi permintaan barang musiman dan *wholesale*. Proyek ini bertujuan memberikan rekomendasi stok berbasis AI yang realistis dan bebas dari *data leakage*.

## 🔑 Key Features
- **Anti-Leakage Target Encoding**: Menerapkan encoding pada `StockCode` murni dari rentang data *train*.
- **External Feature Injection**: Menyuntikkan variabel kondisi cuaca, kelompok wilayah (*region*), dan jarak ke hari libur nasional.
- **Model Tuning**: Menggunakan CatBoost Native Categorical (800 iterations) dengan $R^2 = 45.53\%$ dan MAE = $86.41$ unit pada data uji.
- **ABC Pareto & Dynamic Safety Stock**: Mengklasifikasikan produk ke Kelas A/B/C dan menetapkan stok pengaman berbasis nilai MAE ($3 \times \text{MAE}$ untuk Kelas A).
- **Interactive Web Dashboard**: Aplikasi berbasis Streamlit untuk monitoring dan ekspor hasil rekomendasi stok gudang.

---

## 🛠️ Repository Structure
```text
├── data/
│   ├── raw/               # Petunjuk unduh dataset Kaggle
│   └── processed/         # Hasil rekomendasi stok (CSV)
├── models/
│   └── catboost_model_800.cbm
├── notebooks/
│   └── demand_forecasting.ipynb
├── src/
│   └── predictor.py       # Logika prediksi & agregasi ABC Pareto
├── app.py                 # Streamlit Web App
├── requirements.txt
└── README.md
