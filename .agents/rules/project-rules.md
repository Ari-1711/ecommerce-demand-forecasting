---
trigger: always_on
---

# Agent Rules: E-Commerce Demand Forecasting

## Core Philosophy & Design Rules
- Follow Ousterhout's Deep Module Principle: Hide internal CatBoost model loading, CSV parsing, and calculation details inside `predictor.py` or backend modules. Interfaces must remain simple.
- YAGNI & Minimal Diff (Ponytail Dev): Do not create unnecessary abstractions, extra wrappers, or unused UI components. Reuse existing helpers.
- Clean Code: Keep business logic separated from UI framework components (React / FastAPI / Streamlit). Write code for local reasoning.

## Strictly Forbidden (Boundary Rules)
- DO NOT MODIFY, move, or overwrite anything inside `models/` (.cbm files) and `notebook/` (.ipynb files). These are READ-ONLY.
- All code changes must be strictly limited to `src/`, `backend/`, `frontend/`, `app.py`, or configuration files.

## Stack & Architecture Standard
- Backend: Python (FastAPI / Native Python) to handle `.cbm` model inference and CSV data processing.
- Frontend: React.js (Vite) + Tailwind CSS + Charting Libraries (Recharts/Plotly) for responsive UI/UX (if React is used).
- API Responses: Standardized JSON output format:
  { "success": boolean, "data": object|array, "message": string }