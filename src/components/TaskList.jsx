// TODE i changed the name of    filteredTasks,
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
  deleteTask,
  // setShowModal
}) => {
  return (
    <ul className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem
          task={task}
          editTask={editTask}
          toggleDone={toggleDone}
          startEdit={startEdit}
          editId={editId}
          setEditId={setEditId}
          editText={editText}
          setEditText={setEditText}
          deleteTask={deleteTask}
          // setShowModal={setShowModal}
        />
      ))}
    </ul>
  );
};

export default TaskList;
