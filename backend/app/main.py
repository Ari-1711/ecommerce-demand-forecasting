from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.app.data_loader import DataLoader

app = FastAPI(
    title="E-Commerce Demand Forecasting API",
    description="FastAPI Backend Server for CatBoost Demand Prediction & Inventory Planning",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite local dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize singleton data loader
data_loader = DataLoader()


@app.get("/api/kpis")
def get_kpis():
    """Retrieve top KPI metrics for demand, safety stock, SKU count, and ABC breakdown."""
    kpis = data_loader.get_kpis()
    return {
        "success": True,
        "data": kpis,
        "message": "KPI data retrieved successfully"
    }


@app.get("/api/metrics")
def get_metrics():
    """Retrieve CatBoost 800 AI model performance indicators."""
    metrics = data_loader.get_metrics()
    return {
        "success": True,
        "data": metrics,
        "message": "Model performance metrics retrieved successfully"
    }


@app.get("/api/abc-distribution")
def get_abc_distribution():
    """Retrieve ABC category aggregation and Pareto curve data points."""
    abc_data = data_loader.get_abc_distribution()
    return {
        "success": True,
        "data": abc_data,
        "message": "ABC distribution and Pareto curve data retrieved successfully"
    }


@app.get("/api/recommendations")
def get_recommendations(
    search: str = Query(default="", description="Search by StockCode"),
    kategori_abc: str = Query(default="", description="Filter by ABC class (e.g., Kelas A, Kelas B, Kelas C)"),
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=10, ge=1, le=200, description="Items per page")
):
    """Retrieve paginated inventory recommendation table with search and filtering."""
    recs = data_loader.get_recommendations(
        search=search,
        kategori_abc=kategori_abc,
        page=page,
        limit=limit
    )
    return {
        "success": True,
        "data": recs,
        "message": "Stock recommendations retrieved successfully"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
