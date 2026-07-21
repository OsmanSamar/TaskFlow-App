import { useRef, useEffect } from "react";

const TaskItem = ({
  task,
  editTask,
  toggleDone,
  startEdit,
  editId,
  setEditId,
  editText,
  setEditText,
  deleteTask,

  // setShowModal
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  return (
    <li className="task-item" key={task.id}>
      {/* ToggleDone btn */}
      <button
        type="button"
        onClick={() => toggleDone(task.id)}
        aria-label={task.done ? "Mark as incomplete" : "Mark as complete"}
        className={`tasks-checkbox ${task.done ? "tasks-checkbox--done" : ""}`}
      >
        {task.done && (
          <svg
            className="tasks-check-icon "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {editId === task.id ? (
        <input
          className="task-input "
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editTask(task.id, editText);
              setEditId(null);
              setEditText("");
            }
          }}
        />
      ) : (
        <span className={`task-text ${task.done ? "task-text--done" : ""}`}>
          {task.text}
        </span>
      )}

      {/* Save btn */}
      {editId === task.id ? (
        <>
          <button
            type="button"
            onClick={() => {
              editTask(task.id, editText);
              setEditId(null);
              setEditText("");
            }}
            className="tasks-edit-btn"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setEditText("");
            }}
            className="tasks-edit-btn"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => startEdit(task.id, task.text)}
          className="tasks-edit-btn"
        >
          Edit
        </button>
      )}

      {/* Delete btn */}
      <button
        type="button"
        onClick={() => deleteTask(task.id)}
        // onClick={() => setShowModal(true)}
        className="delete-btn"
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
