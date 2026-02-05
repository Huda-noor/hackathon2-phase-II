from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.routes import utils, tasks

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Register routers
api_router = APIRouter()
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

app.include_router(api_router, prefix=settings.API_V1_STR)
