import { useTranslation } from "react-i18next";
// Import the reusable button so task actions share one component.
import Button from "../components/Button";
import Input from "../components/Input";
const TaskInput = ({
  input,
  setInput,
  addTask,
  showError,
  setShowError,
  dueDate,
  setDueDate,
}) => {
  const { t } = useTranslation();
  return (
    <div className="tasks-input-row">
      <Input
        className="task-input"
        type="text"
        placeholder={t("tasks.inputPlaceholder")}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (e.target.value.trim() !== "") {
            setShowError(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTask();
          }
        }}
      />
      {/* Let the user optionally choose a deadline for the task. */}
      <Input
        className="task-due-date-input"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      {showError === true ? (
        <p className="tasks-error-message">{t("tasks.inputError")}</p>
      ) : (
        ""
      )}

      <Button type="button" onClick={addTask} className="tasks-add-btn">
        {t("tasks.add")}
      </Button>
    </div>
  );
};

export default TaskInput;
