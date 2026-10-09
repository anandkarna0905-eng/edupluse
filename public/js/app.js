const API = {
  students: "/api/students",
  interventions: "/api/interventions"
};

const appState = { students: [], interventions: [] };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
  return payload;
}

function showAlert(message, type = "success") {
  const area = $("#alertArea");
  area.innerHTML = `<div class="alert alert-${type === "error" ? "danger" : type} alert-dismissible fade show" role="alert">${escapeHTML(message)}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
  window.setTimeout(() => {
    const alert = area.querySelector(".alert");
    if (alert) bootstrap.Alert.getOrCreateInstance(alert).close();
  }, 4500);
}

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase() || "ST";
}

function riskBadge(level) {
  const css = String(level || "Low").toLowerCase();
  return `<span class="risk-badge ${css}">${escapeHTML(level || "Low")} risk</span>`;
}

function formatDate(value) {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No due date" : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function navigate(view) {
  const valid = ["dashboard", "students", "interventions"].includes(view) ? view : "dashboard";
  $$(".view-section").forEach(section => section.classList.toggle("d-none", section.id !== `${valid}View`));
  $$(".nav-link[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === valid));
  $("#pageTitle").textContent = valid.charAt(0).toUpperCase() + valid.slice(1);
  $("#sidebar").classList.remove("open");
  if (valid === "students") renderStudents();
  if (valid === "interventions") renderInterventions();
}

async function loadStudents() {
  const result = await apiRequest(API.students);
  appState.students = result.data || [];
  renderDashboard();
  renderStudents();
  populateInterventionStudents();
}

async function loadInterventions() {
  const result = await apiRequest(API.interventions);
  appState.interventions = result.data || [];
  renderDashboard();
  renderInterventions();
}

function renderDashboard() {
  const students = appState.students;
  const high = students.filter(s => s.riskLevel === "High").length;
  const medium = students.filter(s => s.riskLevel === "Medium").length;
  const low = students.filter(s => s.riskLevel === "Low").length;
  const average = students.length ? Math.round(students.reduce((sum, s) => sum + Number(s.attendance), 0) / students.length) : null;
  $("#totalStudents").textContent = students.length;
  $("#highRisk").textContent = high;
  $("#avgAttendance").innerHTML = average === null ? "—<small>%</small>" : `${average}<small>%</small>`;
  $("#openInterventions").textContent = appState.interventions.filter(item => item.status !== "Completed").length;

  const max = Math.max(high, medium, low, 1);
  $("#riskChart").innerHTML = [
    { label: "Low", count: low, color: "#2fb98b" },
    { label: "Medium", count: medium, color: "#efb34f" },
    { label: "High", count: high, color: "#e56579" }
  ].map(item => `<div class="chart-column"><div class="chart-number">${item.count}</div><div class="chart-bar" style="height:${Math.max(4, item.count / max * 110)}px;background:${item.color}"></div><div class="chart-label">${item.label}</div></div>`).join("");

  const priority = [...students].sort((a, b) => {
    const rank = { High: 0, Medium: 1, Low: 2 };
    return rank[a.riskLevel] - rank[b.riskLevel] || a.attendance - b.attendance;
  }).slice(0, 3);
  $("#priorityList").innerHTML = priority.length ? priority.map(student => `
    <div class="priority-item"><span class="priority-icon"><i class="bi bi-person-exclamation"></i></span><div><strong>${escapeHTML(student.name)} · ${escapeHTML(student.studentId)}</strong><p>${student.attendance}% attendance · ${student.marks}/100 marks. Consider a supportive check-in.</p></div></div>
  `).join("") : `<div class="empty-state"><i class="bi bi-emoji-smile"></i><h4>No student records</h4><p>Add a student to see the overview.</p></div>`;

  $("#priorityStudents").innerHTML = priority.length ? priority.map(student => `
    <tr><td><div class="student-name"><span class="student-avatar">${escapeHTML(initials(student.name))}</span><span><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.studentId)}</small></span></div></td><td>${escapeHTML(student.department)}</td><td><span class="progress-mini"><span style="width:${student.attendance}%"></span></span>${student.attendance}%</td><td>${student.marks}/100</td><td>${riskBadge(student.riskLevel)}</td><td><button class="table-action" data-student-detail="${student._id}" title="View details"><i class="bi bi-arrow-up-right"></i></button></td></tr>
  `).join("") : `<tr><td colspan="6" class="text-center text-secondary py-4">No students yet. Add a student to begin.</td></tr>`;
}

function openStudentDetails(id) {
  const student = appState.students.find(item => item._id === id);
  if (!student) return;
  $("#studentDetailTitle").textContent = student.name;
  $("#studentDetailSubtitle").textContent = `${student.studentId} · ${student.department} · Year ${student.year}`;
  const reasons = [];
  if (student.attendance < 75) reasons.push(`Attendance is ${student.attendance}%, below the 75% demo threshold.`);
  if (student.marks < 60) reasons.push(`Marks are ${student.marks}/100, below the 60 mark demo threshold.`);
  if (!reasons.length) reasons.push("Current attendance and marks meet the demo thresholds. Continue routine check-ins.");
  $("#studentDetailBody").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">${riskBadge(student.riskLevel)}<span class="small text-secondary">Updated ${formatDate(student.updatedAt)}</span></div>
    <div class="detail-grid"><div class="detail-box"><small>Attendance</small><strong>${student.attendance}%</strong></div><div class="detail-box"><small>Marks</small><strong>${student.marks}/100</strong></div></div>
    <div class="detail-note"><strong>Suggested supportive next steps</strong><ul class="mb-0 mt-2 ps-3">${reasons.map(reason => `<li class="mb-1">${escapeHTML(reason)}</li>`).join("")}<li>Talk with the student and agree on an achievable support plan.</li></ul></div>
    ${student.notes ? `<div class="mt-3 small text-secondary"><strong>Notes:</strong> ${escapeHTML(student.notes)}</div>` : ""}
  `;
  bootstrap.Modal.getOrCreateInstance($("#studentDetailModal")).show();
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]");
  if (nav) navigate(nav.dataset.view);
  const goto = event.target.closest("[data-goto]");
  if (goto) navigate(goto.dataset.goto);
  const detail = event.target.closest("[data-student-detail]");
  if (detail) openStudentDetails(detail.dataset.studentDetail);
});

$("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

async function initApp() {
  try {
    await Promise.all([loadStudents(), loadInterventions()]);
  } catch (error) {
    showAlert(`${error.message}. Check that MongoDB is running and the Node server started correctly.`, "error");
  }
}

window.initFacultyDashboard = initApp;