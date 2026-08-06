# 📦 E-Commerce Demand Forecasting & Dynamic Safety Stock System

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ecommerce-demand-forecasting-git-main-ari-1711s-projects.vercel.app/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Live Demo:** 🚀 [Akses Dashboard Interaktif (Vercel Fullstack App)](https://ecommerce-demand-forecasting-git-main-ari-1711s-projects.vercel.app/)

Sistem prediksi permintaan barang (*demand forecasting*) 7 hari ke depan pada tingkat SKU e-commerce berbasis **CatBoost Regressor** yang terintegrasi dengan **Analisis ABC Pareto** dan alokasi **Dynamic Safety Stock**. Dilengkapi dengan dashboard analytics modern berbasis **React (Vite + Tailwind CSS)** dan **FastAPI (Python)**.

---

## 📌 Problem & Business Context
Manajemen persediaan gudang pada bisnis e-commerce sering mengalami masalah *overstock* atau *stockout* akibat fluktuasi permintaan barang musiman dan *wholesale*. Proyek ini bertujuan memberikan rekomendasi stok berbasis AI yang realistis dan bebas dari *data leakage*, mengoptimalkan *holding cost*, serta menjaga tingkat *service level* persediaan barang fast-moving.

---

## 🔑 Key Features
- **Anti-Leakage Target Encoding**: Menerapkan encoding pada `StockCode` murni dari rentang data *train*.
- **External Feature Injection**: Menyuntikkan variabel kondisi cuaca, kelompok wilayah (*region*), dan jarak ke hari libur nasional.
- **Model Training & Metrics**: Menggunakan CatBoost Regressor (800 iterations) dengan $R^2 = 45.53\%$ dan MAE = $86.41$ unit pada data uji.
- **ABC Pareto & Dynamic Safety Stock**: Mengklasifikasikan produk ke Kelas A/B/C dan menetapkan stok pengaman berbasis nilai MAE ($3 \times \text{MAE}$ untuk Kelas A).
- **FastAPI REST Server**: Backend Python performa tinggi yang menyediakan REST API (`/api/kpis`, `/api/metrics`, `/api/abc-distribution`, `/api/recommendations`) dengan dukungan sanitasi data otomatis (bebas dari `NaN`/`Infinity`).
- **React Industrial Analytics Dashboard**: Frontend UI/UX berbasis React (Vite + Tailwind CSS) dengan grafik interaktif Recharts (Kurva Pareto & Donut ABC), pencarian instant `StockCode`, filter kelas ABC, badge warna status, dan ekspor CSV.
- **Mobile-First Responsive Design**: Tampilan yang responsif, rapi, dan mudah diakses di smartphone maupun desktop.
- **Serverless Vercel Deployment**: Terkonfigurasi dengan `vercel.json` untuk deployment fullstack serverless tanpa biaya hosting eksternal.

---

## 🛠️ Repository Structure
```text
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── data_loader.py          # Singleton loader & sanitasi data CSV
│   │   └── main.py                 # REST API Server FastAPI
│   └── requirements.txt
├── data/
│   ├── raw/                        # Petunjuk unduh dataset Kaggle
│   └── processed/                  # Hasil rekomendasi stok gudang (CSV)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Mobile responsive navigation & header
│   │   │   ├── KpiGrid.jsx         # Kartu metrik KPI & model performance
│   │   │   ├── ParetoChart.jsx     # Dual-axis Recharts Kurva Pareto Top SKU
│   │   │   ├── FeatureImportanceChart.jsx # Mini horizontal bar driver AI
│   │   │   ├── AbcDonutChart.jsx   # Pie/Donut chart distribusi volume ABC
│   │   │   └── StockTable.jsx      # Tabel rekomendasi stok filterable & paginated
│   │   ├── App.jsx
│   │   └── index.css               # Design system & Tailwind CSS rules
│   ├── .env.development
│   ├── .env.production
│   ├── package.json
│   └── vite.config.js
├── models/
│   └── catboost_model_800.cbm      # Model trained CatBoost Regressor
├── notebooks/
│   └── demand_forecasting.ipynb
├── src/
│   └── predictor.py                # Logika prediksi & agregasi ABC Pareto
├── app.py                          # Streamlit Web App (Alternative Dashboard)
├── vercel.json                     # Konfigurasi Fullstack Vercel Deployment
├── requirements.txt
└── README.md
```

---

## 🚀 How to Run Locally

### 1. Clone repositori ini:
```bash
git clone https://github.com/Ari-1711/ecommerce-demand-forecasting.git
cd ecommerce-demand-forecasting
```

### 2. Buat dan aktifkan Virtual Environment:
* **Windows:**
```cmd
python -m venv .venv
.venv\Scripts\activate
```
* **Mac/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instal dependensi Python:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Jalankan FastAPI Backend Server:
```bash
python -m uvicorn backend.app.main:app --port 8002 --reload
```
*Backend API akan aktif di `http://127.0.0.1:8002/api/kpis`*

### 5. Jalankan React Frontend (Tab Terminal Baru):
```bash
cd frontend
npm install
npm run dev
```
*Dashboard React akan aktif di `http://localhost:5173/`*

---

## ☁️ Deployment on Vercel

Aplikasi ini siap di-deploy langsung ke Vercel dalam satu repositori fullstack menggunakan file [`vercel.json`](file:///d:/ecommerce-demand-forecasting/vercel.json):

1. Push perubahan ke GitHub:
   ```bash
   git add .
   git commit -m "feat: fullstack FastAPI + React dashboard deployment"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan ikuti langkah **Import Project** dari repositori GitHub.
3. Vercel akan otomatis mengenali `vercel.json` dan memproses deployment backend serverless Python (`@vercel/python`) serta frontend React.

---

## 👤 Penulis

**Ari Hermawan**
* GitHub: [@Ari-1711](https://github.com/Ari-1711)
* Demo App: [Akses Demo Vercel](https://ecommerce-demand-forecasting-git-main-ari-1711s-projects.vercel.app/)
