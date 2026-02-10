from datetime import datetime, timezone
from typing import Optional, Literal
from sqlmodel import Field, SQLModel
from pydantic import field_validator

# Status values that match the database enum
TaskStatus = Literal["pending", "in_progress", "completed"]
VALID_STATUSES = {"pending", "in_progress", "completed"}

# Priority values that match the database enum
TaskPriority = Literal["low", "medium", "high"]
VALID_PRIORITIES = {"low", "medium", "high"}


class TaskBase(SQLModel):
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None)
    status: str = Field(default="pending")
    priority: str = Field(default="medium")
    user_id: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {VALID_STATUSES}")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        if v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of: {VALID_PRIORITIES}")
        return v


class Task(TaskBase, table=True):
    """
    Represents a task in the system.

    The Task model includes fields for title, description, status, priority, and user_id,
    along with auto-generated fields for ID and timestamps.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TaskCreate(SQLModel):
    """Schema for creating a new task."""
    title: str = Field(max_length=255)
    description: Optional[str] = None
    status: str = Field(default="pending")
    priority: str = Field(default="medium")
    user_id: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {VALID_STATUSES}")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        if v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of: {VALID_PRIORITIES}")
        return v


class TaskUpdate(SQLModel):
    """Schema for updating an existing task."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {VALID_STATUSES}")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        if v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of: {VALID_PRIORITIES}")
        return v


class TaskRead(TaskBase):
    """Schema for reading a task with its ID and timestamps."""
    id: int
    created_at: datetime
    updated_at: datetime
