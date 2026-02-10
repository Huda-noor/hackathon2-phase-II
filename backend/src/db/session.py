from sqlmodel import create_engine, Session, SQLModel
from src.core.config import settings
# Import models to ensure they are registered with SQLModel.metadata
from src.models.task import Task  # noqa: F401

# Create engine with connection pooling settings optimized for Neon
# pool_pre_ping ensures connections are verified before use
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,  # Recycle connections after 5 minutes
    echo=False,  # Set to True for SQL debugging
)


def init_db():
    """Initialize database tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session as a generator for FastAPI dependency injection."""
    with Session(engine) as session:
        yield session
