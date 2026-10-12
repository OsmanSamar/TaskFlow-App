import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./tasks.css";
import TaskInput from "../components/TaskInput";
import FilterButtons from "../components/FilterButtons";
import TaskList from "../components/TaskList";
import { useTranslation, Trans } from "react-i18next";
import Button from "../components/Button";

const Tasks = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  // Store the optional deadline selected for the new task.
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  // Null thers are no tasks beign modified
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [showError, setShowError] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [tasks, setTasks] = useState([]);

  // Load the current user's tasks when the Tasks page opens.
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/me/tasks",
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to load tasks:", data.message);
          return;
        }

        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };

    loadTasks();
  }, []);

  const activeCount = tasks.filter((task) => !task.done).length;

  // Send the new task to SQLite through the backend API.
  const addTask = async () => {
    if (input.trim() === "") {
      setShowError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/me/tasks", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input.trim(),
          due_date: dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to create task:", data.message);
        return;
      }

      // Add the task returned by SQLite to the visible task list.
      setTasks((currentTasks) => [...currentTasks, data.task]);

      setInput("");
      // Clear the deadline after the task is successfully created.
      setDueDate("");
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // Delete: open confirm popup first
  const requestDelete = (task) => {
    setTaskToDelete(task);
  };

  // Delete the selected task from SQLite and remove it from the UI.
  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/me/tasks/${taskToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to delete task:", data.message);
        return;
      }

      // Remove the task locally after SQLite confirms the deletion.
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskToDelete.id),
      );

      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };
  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  // Update a task's completed status in SQLite and refresh it in the UI.
  const toggleDone = async (id) => {
    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/me/tasks/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            done: task.done ? 0 : 1,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to update task:", data.message);
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? data.task : task)),
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  //Edittask

  const startEdit = (id, text, dueDate) => {
    setEditId(id);
    setEditText(text);
    setEditDueDate(dueDate ? dueDate.slice(0, 10) : "");
  };

  // Update the edited task text in SQLite and then refresh the task in the UI.
  const editTask = async (id, editText) => {
    if (editText.trim() === "") return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/me/tasks/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: editText.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to edit task:", data.message);
        return;
      }

      // Replace the edited task with the updated task returned by SQLite.
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? data.task : task)),
      );
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  // Delete all completed tasks from SQLite and then refresh the UI state.
  const clearCompletedTask = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/me/tasks/completed",
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to clear completed tasks:", data.message);
        return;
      }

      // Remove completed tasks from the visible list after SQLite confirms deletion.
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.done !== 1),
      );
    } catch (error) {
      console.error("Failed to clear completed tasks:", error);
    }
  };

  const filterButtons = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return false;
  });

  return (
    <div className="tasks-page">
      <Sidebar />

      <div className="tasks-main">
        <Header title={t("tasks.title")} />
        <div className="tasks-content">
          <header className="tasks-header">
            <h1>{t("tasks.manager")}</h1>
            <p>{t("tasks.description")}</p>

            <div className="tasks-subtitle">
              {activeCount}{" "}
              {activeCount === 1
                ? t("tasks.taskRemaining")
                : t("tasks.tasksRemaining")}
            </div>
          </header>

          <div className="tasks-card">
            <TaskInput
              input={input}
              setInput={setInput}
              addTask={addTask}
              showError={showError}
              setShowError={setShowError}
              dueDate={dueDate}
              setDueDate={setDueDate}
            />

            <TaskList
              filteredTasks={filteredTasks}
              toggleDone={toggleDone}
              startEdit={startEdit}
              editTask={editTask}
              editId={editId}
              setEditId={setEditId}
              editText={editText}
              setEditText={setEditText}
              requestDelete={requestDelete}
            />

            {filteredTasks.length === 0 && (
              <p className="tasks-empty-state">
                {tasks.length === 0
                  ? t("tasks.noTasks")
                  : t("tasks.noFilteredTasks", { filter })}
              </p>
            )}

            <FilterButtons
              filterButtons={filterButtons}
              filter={filter}
              setFilter={setFilter}
            />

            <div className="tasks-clear-bar">
              <Button
                type="button"
                className="tasks-clear-btn"
                onClick={() => {
                  clearCompletedTask();
                }}
              >
                {t("tasks.clearCompleted")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {taskToDelete && (
        <div
          className="tasks-modal-overlay"
          role="presentation"
          onClick={cancelDelete}
        >
          <div
            className="tasks-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-task-title" className="tasks-modal__title">
              {t("tasks.deleteTitle")}
            </h2>
            <p className="tasks-modal__text">
              {/* Are you sure you want to delete{" "}
              <strong>&ldquo;{taskToDelete.text}&rdquo;</strong>? This cannot be
              undone. */}
              <Trans
                i18nKey="tasks.deleteMessage"
                values={{ task: taskToDelete.text }}
                components={{
                  strong: <strong />,
                }}
              />
            </p>
            <div className="tasks-modal__actions">
              <Button
                type="button"
                className="tasks-modal__btn tasks-modal__btn--cancel"
                onClick={cancelDelete}
              >
                {t("tasks.cancel")}
              </Button>
              <Button
                type="button"
                className="tasks-modal__btn tasks-modal__btn--danger"
                onClick={confirmDelete}
              >
                {t("tasks.delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
