from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoCreate(BaseModel):
    text: str


class TodoUpdate(BaseModel):
    text: str | None = None
    completed: bool | None = None


class Todo(BaseModel):
    id: int
    text: str
    completed: bool


todos = [
    Todo(id=1, text="Learn React", completed=False),
    Todo(id=2, text="Learn FastAPI", completed=False),
]


@app.get("/todos")
def get_todos():
    return todos


@app.post("/todos")
def create_todo(todo: TodoCreate):
    new_todo = Todo(
        id=max([todo.id for todo in todos], default=0) + 1,
        text=todo.text,
        completed=False,
    )

    todos.append(new_todo)

    return new_todo


@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, data: TodoUpdate):
    for todo in todos:
        if todo.id == todo_id:

            if data.text is not None:
                todo.text = data.text

            if data.completed is not None:
                todo.completed = data.completed

            return todo

    raise HTTPException(
        status_code=404,
        detail="Todo not found",
    )


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    global todos

    for todo in todos:
        if todo.id == todo_id:
            todos.remove(todo)
            return {"message": "Todo deleted"}

    raise HTTPException(
        status_code=404,
        detail="Todo not found",
    )