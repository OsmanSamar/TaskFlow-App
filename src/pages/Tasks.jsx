import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./tasks.css";
import TaskInput from "../components/TaskInput";
import FilterButtons from "../components/FilterButtons";
import TaskList from "../components/TaskList";
import { useTranslation, Trans } from "react-i18next";

const Tasks = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  // Null thers are no tasks beign modified
  const [editText, setEditText] = useState("");
  const [showError, setShowError] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (!savedTasks) return [];

    try {
      const parsed = JSON.parse(savedTasks);
      if (!Array.isArray(parsed)) {
        localStorage.removeItem("tasks");
        return [];
      }

      return parsed.map((t) => ({
        id: t?.id ?? crypto.randomUUID(),
        text: typeof t?.text === "string" ? t.text : "",
        done: Boolean(t?.done),
      }));
    } catch {
      localStorage.removeItem("tasks");
      return [];
    }
  });

  const activeCount = tasks.filter((task) => !task.done).length;

  const addTask = () => {
    if (input.trim() === "") {
      setShowError(true);
      return;
    }
    setTasks([...tasks, { id: crypto.randomUUID(), text: input, done: false }]);
    setInput("");
  };

  // Delete: open confirm popup first
  const requestDelete = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = () => {
    if (!taskToDelete) return;
    setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  const toggleDone = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  //Edittask

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const editTask = (id, editText) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editText } : task,
      ),
    );
  };

  // Clear CompletedTask
  const clearCompletedTask = () => {
    const completedTask = tasks.filter((task) => {
      if (task.done === false) {
        return true;
      }
      return false;
    });

    setTasks(completedTask);
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
              <button
                type="button"
                className="tasks-clear-btn"
                onClick={() => {
                  clearCompletedTask();
                }}
              >
                {t("tasks.clearCompleted")}
              </button>
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
              <button
                type="button"
                className="tasks-modal__btn tasks-modal__btn--cancel"
                onClick={cancelDelete}
              >
                {t("tasks.cancel")}
              </button>
              <button
                type="button"
                className="tasks-modal__btn tasks-modal__btn--danger"
                onClick={confirmDelete}
              >
                {t("tasks.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
