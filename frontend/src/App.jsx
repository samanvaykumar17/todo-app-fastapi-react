import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./services/todoApi";

import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load todos when application starts
  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      setError("");

      const data = await getTodos();

      setTodos(data);
    } catch (error) {
      setError("Could not load todos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(text) {
    try {
      const newTodo = await createTodo(text);

      setTodos((currentTodos) => [
        ...currentTodos,
        newTodo,
      ]);
    } catch (error) {
      console.error(error);
      setError("Could not create todo");
    }
  }

  async function toggleTodo(id) {
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) return;

    try {
      const updatedTodo = await updateTodo(id, {
        completed: !todo.completed,
      });

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error(error);
      setError("Could not update todo");
    }
  }

  async function deleteTodoItem(id) {
    try {
      await deleteTodo(id);

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      console.error(error);
      setError("Could not delete todo");
    }
  }

  async function editTodo(id, text) {
    try {
      const updatedTodo = await updateTodo(id, {
        text,
      });

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error(error);
      setError("Could not edit todo");
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

  const totalTodos = todos.length;

  const completedTodos = todos.filter(
    (todo) => todo.completed
  ).length;

  const remainingTodos = totalTodos - completedTodos;

  return (
    <div className="app">
      <h1>Todo App</h1>

      <TodoForm onAdd={addTodo} />

      <TodoFilter
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="stats">
        <p>Total: {totalTodos}</p>
        <p>Active: {remainingTodos}</p>
        <p>Completed: {completedTodos}</p>
      </div>

      {loading && <p>Loading todos...</p>}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {!loading && filteredTodos.length === 0 && (
        <p>No todos found.</p>
      )}

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodoItem}
        onEdit={editTodo}
      />
    </div>
  );
}

export default App;