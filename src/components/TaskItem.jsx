import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const TaskItem = ({
  task,
  editTask,
  toggleDone,
  startEdit,
  editId,
  setEditId,
  editText,
  setEditText,
  requestDelete,
}) => {
  const { t } = useTranslation();
  // useRef keeps a reference to the DOM input element without causing a re-render.
  // We use it here to automatically focus the input when editing a task starts.
  const inputRef = useRef(null);
  // When editId changes, the edit input appears.
  // useEffect runs after render, then focus() places the cursor inside the input.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  return (
    <li className="task-item">
      {/* ToggleDone btn */}
      <button
        type="button"
        onClick={() => toggleDone(task.id)}
        aria-label={
          task.done ? t("tasks.markIncomplete") : t("tasks.markComplete")
        }
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
            {t("tasks.save")}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setEditText("");
            }}
            className="tasks-edit-btn"
          >
            {t("tasks.cancel")}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => startEdit(task.id, task.text)}
          className="tasks-edit-btn"
        >
          {t("tasks.edit")}
        </button>
      )}

      {/* Delete btn — opens confirm popup */}
      <button
        type="button"
        onClick={() => requestDelete(task)}
        className="delete-btn"
      >
        {t("tasks.delete")}
      </button>
    </li>
  );
};

export default TaskItem;
