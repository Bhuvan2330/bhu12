const appState = {
  role: null,
  userEmail: null,
  tasks: [
    {
      id: 1,
      title: "Vendor enquiry",
      description: "Capture vendor questions, proposals and responses.",
      category: "Vendor",
      status: "pending",
      channel: "",
      notes: "",
    },
    {
      id: 2,
      title: "Vendor meeting and notes",
      description: "Schedule and record meeting notes using communication channels.",
      category: "Vendor",
      status: "in-progress",
      channel: "Google Meet",
      notes: "Discussed timelines, approvals and next onboarding steps.",
    },
    {
      id: 3,
      title: "Vendor onboarding",
      description: "Complete the vendor registration and compliance onboarding.",
      category: "Vendor",
      status: "pending",
      channel: "",
      notes: "",
    },
    {
      id: 4,
      title: "Project onboarding",
      description: "Bring the project stakeholders and vendor together.",
      category: "Project",
      status: "pending",
      channel: "",
      notes: "",
    },
    {
      id: 5,
      title: "Requirement gathering",
      description: "Collect requirements and align vendor delivery expectations.",
      category: "Project",
      status: "pending",
      channel: "",
      notes: "",
    },
    {
      id: 6,
      title: "Project kick off",
      description: "Finalize scope and launch the project execution.",
      category: "Project",
      status: "pending",
      channel: "",
      notes: "",
    },
  ],
};

const credentials = {
  vendor: { email: "vendor@example.com", password: "vendor123" },
  management: { email: "pm@example.com", password: "manager123" },
};

const pages = {
  home: document.getElementById("homePage"),
  vendorLogin: document.getElementById("vendorLoginPage"),
  managementLogin: document.getElementById("managementLoginPage"),
  dashboard: document.getElementById("dashboardPage"),
};

const tokenElements = {
  labelRole: document.getElementById("currentRoleLabel"),
  welcomeText: document.getElementById("welcomeText"),
  taskList: document.getElementById("taskList"),
  roleTitle: document.getElementById("dashboardTitle"),
  logoutBtn: document.getElementById("logoutButton"),
  taskNotes: document.getElementById("taskNotesInput"),
  taskChannel: document.getElementById("taskChannelSelect"),
  noteSubmit: document.getElementById("saveNoteButton"),
  selectedTaskTitle: document.getElementById("selectedTaskTitle"),
};

const taskForm = document.getElementById("meetingNoteForm");
const selectedTaskIdInput = document.getElementById("selectedTaskId");

function showPage(pageName) {
  Object.values(pages).forEach((page) => page.classList.remove("active"));
  pages[pageName].classList.add("active");
}

function updateDashboardHeader() {
  tokenElements.labelRole.textContent = appState.role === "vendor" ? "Vendor Portal" : "Project Management Portal";
  tokenElements.welcomeText.textContent = `Logged in as ${appState.userEmail}`;
  tokenElements.roleTitle.textContent = appState.role === "vendor" ? "Vendor Tasks" : "Project Management Tasks";
}

function renderTaskList() {
  const relevantTasks = appState.tasks.filter((task) => {
    if (appState.role === "vendor") return task.category === "Vendor";
    return task.category === "Project";
  });

  tokenElements.taskList.innerHTML = relevantTasks
    .map((task) => {
      return `
      <article class="task-card">
        <header>
          <div>
            <h3>${task.title}</h3>
            <span class="status-pill status-${task.status.replace(" ", "")}">${task.status}</span>
          </div>
          <button type="button" class="link" onclick="openTaskNote(${task.id})">Update</button>
        </header>
        <p>${task.description}</p>
        <div class="quick-info">
          <div><span class="info-label">Communication channel</span><span>${task.channel || "Not set"}</span></div>
          <div><span class="info-label">Notes</span><span>${task.notes || "No notes yet"}</span></div>
        </div>
      </article>
    `;
    })
    .join("");
}

function openTaskNote(taskId) {
  const task = appState.tasks.find((item) => item.id === taskId);
  if (!task) return;
  selectedTaskIdInput.value = task.id;
  tokenElements.selectedTaskTitle.textContent = task.title;
  tokenElements.taskNotes.value = task.notes;
  tokenElements.taskChannel.value = task.channel || "Google Meet";
  showPage("dashboard");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function saveTaskNote(event) {
  event.preventDefault();
  const taskId = Number(selectedTaskIdInput.value);
  const task = appState.tasks.find((item) => item.id === taskId);
  if (!task) return;
  task.notes = tokenElements.taskNotes.value.trim();
  task.channel = tokenElements.taskChannel.value;
  if (task.notes && task.status === "pending") {
    task.status = "in-progress";
  }
  renderTaskList();
}

function handleLogin(role, email, password) {
  const account = credentials[role];
  if (email === account.email && password === account.password) {
    appState.role = role;
    appState.userEmail = email;
    updateDashboardHeader();
    renderTaskList();
    showPage("dashboard");
  } else {
    alert("Invalid email or password. Use example credentials from the login box.");
  }
}

function initEvents() {
  document.getElementById("vendorButton").addEventListener("click", () => showPage("vendorLogin"));
  document.getElementById("managementButton").addEventListener("click", () => showPage("managementLogin"));
  document.getElementById("homeBackButton").addEventListener("click", () => showPage("home"));
  document.getElementById("vendorBackButton").addEventListener("click", () => showPage("home"));
  document.getElementById("managementBackButton").addEventListener("click", () => showPage("home"));
  tokenElements.logoutBtn.addEventListener("click", () => {
    appState.role = null;
    appState.userEmail = null;
    showPage("home");
  });

  document.getElementById("vendorLoginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    handleLogin("vendor", email, password);
  });

  document.getElementById("managementLoginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    handleLogin("management", email, password);
  });

  taskForm.addEventListener("submit", saveTaskNote);
}

window.addEventListener("DOMContentLoaded", () => {
  initEvents();
  showPage("home");
});
