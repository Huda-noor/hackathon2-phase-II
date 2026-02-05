from typing import List, Optional

from sqlmodel import Session, select

from src.models.task import Task, TaskCreate, TaskUpdate


def get_all_tasks(db: Session) -> List[Task]:
    return db.exec(select(Task)).all()


def get_task_by_id(db: Session, task_id: int) -> Optional[Task]:
    return db.get(Task, task_id)


def create_task(db: Session, task: TaskCreate) -> Task:
    db_task = Task.from_orm(task)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task: TaskUpdate) -> Optional[Task]:
    db_task = db.get(Task, task_id)
    if db_task:
        task_data = task.dict(exclude_unset=True)
        for key, value in task_data.items():
            setattr(db_task, key, value)
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> Optional[Task]:
    db_task = db.get(Task, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task
