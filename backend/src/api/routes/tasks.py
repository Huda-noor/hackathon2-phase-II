from typing import List, Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.db.session import get_session

from src.api.deps import get_current_user
from src.models.task import Task, TaskCreate, TaskRead, TaskUpdate
from src.services import task_service

router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/", response_model=TaskRead)
def create_task(
    *,
    db: SessionDep,
    task_in: TaskCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Create new task.
    """
    if task_in.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to create tasks for other users")
    task = task_service.create_task(db=db, task=task_in)
    return task


@router.get("/", response_model=List[TaskRead])
def read_tasks(
    db: SessionDep,
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve tasks for the current user.
    """
    tasks = db.exec(select(Task).where(Task.user_id == current_user["id"])).all()
    return tasks


@router.get("/{id}", response_model=TaskRead)
def read_task(
    *,
    db: SessionDep,
    id: int,
    current_user: dict = Depends(get_current_user),
):
    """
    Get task by ID.
    """
    task = task_service.get_task_by_id(db=db, task_id=id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this task")
    return task


@router.patch("/{id}", response_model=TaskRead)
def update_task(
    *,
    db: SessionDep,
    id: int,
    task_in: TaskUpdate,
    current_user: dict = Depends(get_current_user),
):
    """
    Update a task.
    """
    task = task_service.get_task_by_id(db=db, task_id=id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
    task = task_service.update_task(db=db, task_id=id, task=task_in)
    return task


@router.delete("/{id}")
def delete_task(
    *,
    db: SessionDep,
    id: int,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete a task.
    """
    task = task_service.get_task_by_id(db=db, task_id=id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")
    task_service.delete_task(db=db, task_id=id)
    return {"ok": True}
