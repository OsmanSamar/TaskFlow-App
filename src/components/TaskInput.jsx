const TaskInput = ({ input, setInput, addTask, showError, setShowError }) => {
    return (
      <div className="input-row">
        <input
          className="task-input"
          type="text"
          placeholder="What needs to be done?"
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
  
        {showError === true ? (
          <p className="error-message">Please enter your task.</p>
        ) : (
          ""
        )}
        <button onClick={addTask} className="add-btn">
          Add
        </button>
      </div>
    );
  };
  
  export default TaskInput;
  