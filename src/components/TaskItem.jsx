import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Input from "../components/Input";

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
  editDueDate,
  setEditDueDate,
}) => {
  const { t, i18n } = useTranslation();

  // Keep a reference to the edit input so we can focus it automatically.
  const inputRef = useRef(null);

  // Store the current time outside the render calculation.
  const [now, setNow] = useState(() => new Date());

  // Keep the current time updated once per minute.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Focus the edit input whenever editing starts.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  // Calculate the deadline status once so the JSX stays simple.
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  // Calculate deadline status using the stored current time.
  const today = now;
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const dueDateColor = !dueDate
    ? ""
    : dueDate < today
      ? "text-red-500 dark:text-red-400"
      : dueDate <= threeDaysFromNow
        ? "text-orange-500 dark:text-orange-400"
        : "text-green-500 dark:text-green-400";

  // Format the deadline according to the user's selected language.
  const formattedDueDate = task.due_date
    ? new Intl.DateTimeFormat(i18n.language, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(task.due_date))
    : "";

  return (
    <li className="task-item">
      {/* Toggle the task between completed and incomplete. */}
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
            className="tasks-check-icon"
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

      {/* Keep the task title on the first line and deadline/actions on the second line. */}
      <div className="task-details">
        {editId === task.id ? (
          // <Input
          //   className="task-input"
          //   ref={inputRef}
          //   value={editText}
          //   onChange={(e) => setEditText(e.target.value)}
          //   onKeyDown={(e) => {
          //     if (e.key === "Enter") {
          //       editTask(task.id, editText);
          //       setEditId(null);
          //       setEditText("");
          //     }
          //   }}
          // />
          <div className="task-edit-fields">
            <Input
              className="task-input"
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

            <input
              type="date"
              className="task-input"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />


          </div>
        ) : (
          <span className={`task-text ${task.done ? "task-text--done" : ""}`}>
            {task.text}
          </span>
        )}

        {/* Keep deadline and action buttons together on the second row. */}
        <div className="task-meta">
          {/*  Color the deadline based on how close or overdue it is. */}
          {/* Display the deadline using the calculated status color. */}
          {task.due_date && (
            <span className={`task-due-date ${dueDateColor}`}>
              {/* Display the deadline using the user's current language. */}
              Due: {formattedDueDate}
            </span>
          )}
          <div className="task-actions">
            {editId === task.id ? (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    editTask(task.id, editText);
                    setEditId(null);
                    setEditText("");
                  }}
                  className="tasks-edit-btn"
                >
                  {t("tasks.save")}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => startEdit(task.id, task.text)}
                className="tasks-edit-btn"
              >
                {t("tasks.edit")}
              </Button>
            )}

            <Button
              type="button"
              onClick={() => requestDelete(task)}
              className="delete-btn"
            >
              {t("tasks.delete")}
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
