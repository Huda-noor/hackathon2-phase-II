from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    status: str = Field(default="Todo", regex="^(Todo|InProgress|Done)$")
    owner_id: str = Field(index=True)


class Task(TaskBase, table=True):
    """
    Represents a task in the system.
    
    The Task model includes fields for title, description, status, and owner_id,
    along with auto-generated fields for ID and timestamps.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default=None)


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    title: str
    owner_id: str


class TaskUpdate(SQLModel):
    """Schema for updating an existing task."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None  # Will use regex validation


class TaskRead(TaskBase):
    """Schema for reading a task with its ID and timestamps."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None