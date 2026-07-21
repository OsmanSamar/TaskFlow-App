import TaskItem from "./TaskItem";

const TaskList = ({
  filteredTasks,
  toggleDone,
  startEdit,
  editTask,
  editId,
  setEditId,
  editText,
  setEditText,
  requestDelete,
}) => {
  return (
    <ul className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editTask={editTask}
          toggleDone={toggleDone}
          startEdit={startEdit}
          editId={editId}
          setEditId={setEditId}
          editText={editText}
          setEditText={setEditText}
          requestDelete={requestDelete}
        />
      ))}
    </ul>
  );
};

export default TaskList;
