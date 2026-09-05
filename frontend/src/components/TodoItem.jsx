import { useState } from "react";

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (!editText.trim()) {
      return;
    }

    onEdit(todo.id, editText.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <li className="todo-item">
      {isEditing ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <button onClick={handleEdit}>
            Save
          </button>

          <button onClick={handleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span
            onClick={() => onToggle(todo.id)}
            className={todo.completed ? "completed" : ""}
          >
            {todo.text}
          </span>

          <div>
            <button onClick={() => setIsEditing(true)}>
              Edit
            </button>

            <button onClick={() => onDelete(todo.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;