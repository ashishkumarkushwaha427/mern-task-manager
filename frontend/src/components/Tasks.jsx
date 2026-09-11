import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const getTasks = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://mern-task-manager-guls.onrender.com/api/tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTasks(data);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://mern-task-manager-guls.onrender.com/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTasks([...tasks, data]);
      setTitle("");
      setDescription("");
    } else {
      alert(data.message);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://mern-task-manager-guls.onrender.com/api/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTasks(tasks.filter((task) => task._id !== id));
    } else {
      alert(data.message);
    }
  };

  const handleToggleComplete = async (task) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://mern-task-manager-guls.onrender.com/api/tasks/${task._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTasks(
        tasks.map((item) =>
          item._id === task._id ? data : item
        )
      );
    } else {
      alert(data.message);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdateTask = async (id) => {
    if (!editTitle.trim()) {
      alert("Please enter task title");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://mern-task-manager-guls.onrender.com/api/tasks/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTasks(
        tasks.map((task) =>
          task._id === id ? data : task
        )
      );

      setEditingId(null);
      setEditTitle("");
      setEditDescription("");
    } else {
      alert(data.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="app">
      <div className="container">

        {/* Header */}
        <div className="header">
          <div>
            <div className="small-title">TASK MANAGER</div>

            <h1>My Tasks</h1>

            <p className="subtitle">
              Stay organized and get things done.
            </p>
          </div>

          <div className="stats">
            <div className="stat">
              <span>{tasks.length}</span>
              <small>Total</small>
            </div>

            <div className="stat">
              <span>{completedTasks}</span>
              <small>Done</small>
            </div>

            <button
              className="delete-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Task */}
        <div className="add-card">
          <h2>Add New Task</h2>

          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Add a description..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              type="submit"
              className="add-btn"
            >
              + Add Task
            </button>
          </form>
        </div>

        {/* Tasks */}
        <div className="tasks-section">

          <div className="section-heading">
            <h2>Your Tasks</h2>

            <span>
              {tasks.length}{" "}
              {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✓</div>

              <h3>No tasks yet</h3>

              <p>
                Add your first task above and start getting things done.
              </p>
            </div>
          ) : (
            <div className="task-list">

              {tasks.map((task) => (

                <div
                  key={task._id}
                  className={`task-card ${
                    task.completed ? "completed" : ""
                  }`}
                >

                  {editingId === task._id ? (

                    <div className="task-content">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(e.target.value)
                        }
                      />

                      <textarea
                        rows="3"
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(e.target.value)
                        }
                      />

                      <button
                        className="add-btn"
                        onClick={() =>
                          handleUpdateTask(task._id)
                        }
                      >
                        Save
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          setEditingId(null)
                        }
                      >
                        Cancel
                      </button>
                    </div>

                  ) : (

                    <>
                      <div className="task-left">

                        <button
                          className={`check ${
                            task.completed ? "checked" : ""
                          }`}
                          onClick={() =>
                            handleToggleComplete(task)
                          }
                        >
                          {task.completed ? "✓" : ""}
                        </button>

                        <div className="task-content">

                          <h3>{task.title}</h3>

                          <p>{task.description}</p>

                          <span
                            className={`status ${
                              task.completed
                                ? "done"
                                : "pending"
                            }`}
                          >
                            {task.completed
                              ? "Completed"
                              : "Pending"}
                          </span>

                        </div>

                      </div>

                      <div>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleEditClick(task)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteTask(task._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}

                </div>

              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Tasks;