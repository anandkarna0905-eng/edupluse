function populateInterventionStudents() {
  const select = $("#interventionStudent");
  const previous = select.value;
  select.innerHTML = `<option value="">Select a student</option>` + appState.students
    .map(student => `<option value="${student._id}">${escapeHTML(student.name)} (${escapeHTML(student.studentId)})</option>`).join("");
  if (appState.students.some(student => student._id === previous)) select.value = previous;
}

function renderInterventions() {
  const items = appState.interventions;
  $("#interventionCount").textContent = `${items.length} record${items.length === 1 ? "" : "s"}`;
  $("#emptyInterventions").classList.toggle("d-none", items.length > 0);
  $("#interventionList").innerHTML = items.map(item => {
    const studentName = item.student?.name || "Student removed";
    const statusOptions = ["Planned", "In Progress", "Completed"].map(status =>
      `<option ${item.status === status ? "selected" : ""}>${status}</option>`).join("");
    return `<div class="intervention-item">
      <span class="intervention-symbol"><i class="bi bi-clipboard2-check"></i></span>
      <div class="intervention-main"><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.description || "No description provided.")}</p><div class="intervention-meta"><span><i class="bi bi-person me-1"></i>${escapeHTML(studentName)}</span><span><i class="bi bi-calendar3 me-1"></i>${formatDate(item.dueDate)}</span>${item.student?.riskLevel ? riskBadge(item.student.riskLevel) : ""}</div></div>
      <div class="d-flex flex-column gap-2 align-items-end"><select class="form-select status-select" data-intervention-status="${item._id}" aria-label="Intervention status">${statusOptions}</select><button class="btn btn-sm btn-link text-danger text-decoration-none" data-delete-intervention="${item._id}"><i class="bi bi-trash3 me-1"></i>Delete</button></div>
    </div>`;
  }).join("");
}

$("#interventionForm").addEventListener("submit", async event => {
  event.preventDefault();
  const body = {
    student: $("#interventionStudent").value,
    title: $("#interventionTitle").value.trim(),
    description: $("#interventionDescription").value.trim(),
    dueDate: $("#interventionDueDate").value || null
  };
  try {
    await apiRequest(API.interventions, { method: "POST", body: JSON.stringify(body) });
    $("#interventionForm").reset();
    await loadInterventions();
    showAlert("Intervention created successfully.");
  } catch (error) {
    showAlert(error.message, "error");
  }
});

$("#interventionList").addEventListener("change", async event => {
  const select = event.target.closest("[data-intervention-status]");
  if (!select) return;
  try {
    await apiRequest(`${API.interventions}/${select.dataset.interventionStatus}`, {
      method: "PUT", body: JSON.stringify({ status: select.value })
    });
    await loadInterventions();
    showAlert("Intervention status updated.");
  } catch (error) {
    showAlert(error.message, "error");
  }
});

$("#interventionList").addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-intervention]");
  if (!button || !confirm("Delete this intervention?")) return;
  try {
    await apiRequest(`${API.interventions}/${button.dataset.deleteIntervention}`, { method: "DELETE" });
    await loadInterventions();
    showAlert("Intervention deleted.");
  } catch (error) {
    showAlert(error.message, "error");
  }
});