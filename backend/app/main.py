import os
import sys

# Add project root to sys.path
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.app.data_loader import DataLoader
except ImportError:
    from app.data_loader import DataLoader

app = FastAPI(
    title="E-Commerce Demand Forecasting API",
    description="FastAPI Backend Server for CatBoost Demand Prediction & Inventory Planning",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite local dev server & Vercel deployments)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize singleton data loader
data_loader = DataLoader()


@app.get("/")
@app.get("/api")
def root_health():
    """Health check endpoint for Vercel Serverless deployment."""
    return {
        "status": "online",
        "service": "E-Commerce Demand Forecasting API",
        "model": "CatBoost 800 (CSV Pipeline Active)",
        "version": "1.0.0"
    }


@app.get("/api/kpis")
def get_kpis():
    """Retrieve top KPI metrics for demand, safety stock, SKU count, and ABC breakdown."""
    try:
        kpis = data_loader.get_kpis()
        return {
            "success": True,
            "data": kpis,
            "message": "KPI data retrieved successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving KPI data: {str(e)}"
        }


@app.get("/api/metrics")
def get_metrics():
    """Retrieve CatBoost 800 AI model performance indicators."""
    try:
        metrics = data_loader.get_metrics()
        return {
            "success": True,
            "data": metrics,
            "message": "Model performance metrics retrieved successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving metrics data: {str(e)}"
        }


@app.get("/api/abc-distribution")
def get_abc_distribution():
    """Retrieve ABC category aggregation and Pareto curve data points."""
    try:
        abc_data = data_loader.get_abc_distribution()
        return {
            "success": True,
            "data": abc_data,
            "message": "ABC distribution and Pareto curve data retrieved successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving ABC distribution data: {str(e)}"
        }


@app.get("/api/recommendations")
def get_recommendations(
    search: str = Query(default="", description="Search by StockCode"),
    kategori_abc: str = Query(default="", description="Filter by ABC class (e.g., Kelas A, Kelas B, Kelas C)"),
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=10, ge=1, le=200, description="Items per page")
):
    """Retrieve paginated inventory recommendation table with search and filtering."""
    try:
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
    except Exception as e:
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving recommendations: {str(e)}"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8002, reload=True)
