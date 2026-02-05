from sqlmodel import create_engine, Session, SQLModel
from src.core.config import settings

# Create engine - adding connect_args check since postgres doesn't support check_same_thread
# which is needed for sqlite
engine = create_engine(settings.DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
