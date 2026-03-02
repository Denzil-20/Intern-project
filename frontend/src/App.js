import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/v1";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const extractError = (data) => {
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(e => e.message).join(", ");
    }

    if (data.error) {
      try {
        const parsed = JSON.parse(data.error);
        if (Array.isArray(parsed)) {
          return parsed.map(e => e.message).join(", ");
        }
      } catch {
        return data.error;
      }
    }

    if (data.message) return data.message;

    return "Something went wrong";
  };

  const register = async () => {
    setMessage("");

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name: email.split("@")[0]
      })
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Registration successful. Please login.");
      setIsLogin(true);
    } else {
      setMessage(extractError(data));
    }
  };

  const login = async () => {
    setMessage("");

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      setMessage(extractError(data));
    }
  };

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (Array.isArray(data)) {
      setTasks(data);
    }
  };

  const createTask = async () => {
    setMessage("");

    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();

    if (res.ok) {
      setTitle("");
      setContent("");
      fetchTasks();
    } else {
      setMessage(extractError(data));
    }
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
    setMessage("");
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>{isLogin ? "Login" : "Register"}</h2>

          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            style={styles.primaryBtn}
            onClick={isLogin ? login : register}
          >
            {isLogin ? "Login" : "Register"}
          </button>

          {message && <p style={styles.error}>{message}</p>}

          <p style={{ marginTop: 15 }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>

          <button
            style={styles.linkBtn}
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            Switch to {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <div style={styles.topBar}>
        <h2>Task Dashboard</h2>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={styles.createBox}>
        <input
          style={styles.input}
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Task Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <button style={styles.primaryBtn} onClick={createTask}>
          Create Task
        </button>
      </div>

      {message && <p style={styles.error}>{message}</p>}

      <ul style={styles.taskList}>
        {tasks.map(task => (
          <li key={task.id} style={styles.taskItem}>
            <div>
              <strong>{task.title}</strong>
              <div>{task.content}</div>
            </div>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f6f8"
  },
  card: {
    width: 350,
    padding: 30,
    background: "white",
    borderRadius: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  primaryBtn: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer"
  },
  error: {
    color: "red",
    marginTop: 10
  },
  dashboard: {
    padding: 40,
    background: "#f4f6f8",
    minHeight: "100vh"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  logoutBtn: {
    padding: "8px 14px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  createBox: {
    marginBottom: 20
  },
  taskList: {
    listStyle: "none",
    padding: 0
  },
  taskItem: {
    background: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 6,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },
  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer"
  }
};

export default App;