// Task 8 – Final Frontend Logic
// Developed by Ubaidulla

const API = "/api";

/* ---------------- AUTH ---------------- */

async function register() {
  const name = rName.value;
  const email = rEmail.value;
  const password = rPassword.value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  authMsg.textContent = data.message || "Registered successfully";
}

async function login() {
  const email = lEmail.value;
  const password = lPassword.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    authMsg.textContent = "Login failed";
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* ---------------- TASKS ---------------- */

async function loadTasks() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch(`${API}/tasks`, {
    headers: { Authorization: token }
  });

  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task" + (t.status === "Completed" ? " completed" : "");
    div.innerHTML = `
      <strong>${t.title}</strong>
      <p>${t.description || ""}</p>
      <button onclick="deleteTask('${t._id}')">Delete</button>
    `;
    list.appendChild(div);
  });
}

async function addTask() {
  const title = taskTitle.value;
  const description = taskDesc.value;
  const token = localStorage.getItem("token");

  if (!title) {
    alert("Task title required");
    return;
  }

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ title, description })
  });

  taskTitle.value = "";
  taskDesc.value = "";
  loadTasks();
}

async function deleteTask(id) {
  const token = localStorage.getItem("token");

  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });

  loadTasks();
}

/* Auto-load dashboard */
if (window.location.pathname.includes("dashboard")) {
  loadTasks();
}
