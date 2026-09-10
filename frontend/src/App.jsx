import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    const response = await fetch("https://mern-task-manager-guls.onrender.com/api/tasks");
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    await fetch("https://mern-task-manager-guls.onrender.com/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`https://mern-task-manager-guls.onrender.com/api/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await fetch(`https://mern-task-manager-guls.onrender.com/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    fetchTasks();
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <div>
            <p className="small-title">MY WORKSPACE</p>
            <h1>Task Manager</h1>
            <p className="subtitle">
              Organize your work and stay productive.
            </p>
          </div>

          <div className="stats">
            <div className="stat">
              <span>{tasks.length}</span>
              <small>Total</small>
            </div>

            <div className="stat">
              <span>{pendingTasks}</span>
              <small>Pending</small>
            </div>

            <div className="stat">
              <span>{completedTasks}</span>
              <small>Done</small>
            </div>
          </div>
        </header>

        <section className="add-card">
          <h2>Add New Task</h2>

          <form onSubmit={addTask}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />

            <button type="submit" className="add-btn">
              + Add Task
            </button>
          </form>
        </section>

        <section className="tasks-section">
          <div className="section-heading">
            <h2>Your Tasks</h2>
            <span>{tasks.length} tasks</span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>Add your first task above.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  className={`task-card ${
                    task.completed ? "completed" : ""
                  }`}
                  key={task._id}
                >
                  <div className="task-left">
                    <button
                      className={`check ${
                        task.completed ? "checked" : ""
                      }`}
                      onClick={() => toggleComplete(task)}
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="task-content">
                      <h3>{task.title}</h3>
                      <p>{task.description || "No description"}</p>

                      <span
                        className={`status ${
                          task.completed ? "done" : "pending"
                        }`}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default App;