const studentModalElement = $("#studentModal");
const studentModal = bootstrap.Modal.getOrCreateInstance(studentModalElement);

function renderStudents() {
  const query = ($("#studentSearch")?.value || "").trim().toLowerCase();
  const risk = $("#riskFilter")?.value || "";
  const filtered = appState.students.filter(student => {
    const matchesText = [student.name, student.studentId, student.department].some(value => String(value || "").toLowerCase().includes(query));
    return matchesText && (!risk || student.riskLevel === risk);
  });

  $("#studentsTable").innerHTML = filtered.map(student => `
    <tr>
      <td><div class="student-name"><span class="student-avatar">${escapeHTML(initials(student.name))}</span><span><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.studentId)}</small></span></div></td>
      <td>${escapeHTML(student.department)}</td><td>Year ${student.year}</td>
      <td><span class="progress-mini"><span style="width:${student.attendance}%"></span></span>${student.attendance}%</td>
      <td>${student.marks}/100</td><td>${riskBadge(student.riskLevel)}</td>
      <td><div class="d-flex gap-1"><button class="table-action" data-student-detail="${student._id}" title="Details"><i class="bi bi-eye"></i></button><button class="table-action" data-edit-student="${student._id}" title="Edit"><i class="bi bi-pencil"></i></button><button class="table-action text-danger" data-delete-student="${student._id}" title="Delete"><i class="bi bi-trash3"></i></button></div></td>
    </tr>`).join("");

  $("#emptyStudents").classList.toggle("d-none", filtered.length > 0);
}

function resetStudentForm() {
  $("#studentForm").reset();
  $("#studentMongoId").value = "";
  $("#studentModalTitle").textContent = "Add student";
  $("#saveStudentBtn").textContent = "Save student";
}

function openAddStudent() {
  resetStudentForm();
  studentModal.show();
}

function openEditStudent(id) {
  const student = appState.students.find(item => item._id === id);
  if (!student) return;
  resetStudentForm();
  $("#studentMongoId").value = student._id;
  $("#studentId").value = student.studentId;
  $("#studentName").value = student.name;
  $("#department").value = student.department;
  $("#studentYear").value = student.year;
  $("#attendance").value = student.attendance;
  $("#marks").value = student.marks;
  $("#studentNotes").value = student.notes || "";
  $("#studentModalTitle").textContent = "Edit student";
  $("#saveStudentBtn").textContent = "Update student";
  studentModal.show();
}

$("#topAddStudent").addEventListener("click", openAddStudent);
$("#addStudentBtn").addEventListener("click", openAddStudent);
$("#studentSearch").addEventListener("input", renderStudents);
$("#riskFilter").addEventListener("change", renderStudents);
$("#refreshStudents").addEventListener("click", async () => {
  try { await loadStudents(); showAlert("Student list refreshed."); }
  catch (error) { showAlert(error.message, "error"); }
});

$("#studentForm").addEventListener("submit", async event => {
  event.preventDefault();
  const id = $("#studentMongoId").value;
  const body = {
    studentId: $("#studentId").value.trim(),
    name: $("#studentName").value.trim(),
    department: $("#department").value.trim(),
    year: Number($("#studentYear").value),
    attendance: Number($("#attendance").value),
    marks: Number($("#marks").value),
    notes: $("#studentNotes").value.trim()
  };

  if (body.attendance < 0 || body.attendance > 100 || body.marks < 0 || body.marks > 100) {
    showAlert("Attendance and marks must be between 0 and 100.", "error");
    return;
  }

  const saveButton = $("#saveStudentBtn");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";
  try {
    await apiRequest(id ? `${API.students}/${id}` : API.students, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(body)
    });
    studentModal.hide();
    await loadStudents();
    showAlert(id ? "Student updated successfully." : "Student added successfully.");
  } catch (error) {
    showAlert(error.message, "error");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = id ? "Update student" : "Save student";
  }
});

document.addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit-student]");
  if (editButton) openEditStudent(editButton.dataset.editStudent);

  const deleteButton = event.target.closest("[data-delete-student]");
  if (deleteButton) {
    const student = appState.students.find(item => item._id === deleteButton.dataset.deleteStudent);
    if (!student || !confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    try {
      await apiRequest(`${API.students}/${student._id}`, { method: "DELETE" });
      await loadStudents();
      await loadInterventions();
      showAlert("Student deleted.");
    } catch (error) {
      showAlert(error.message, "error");
    }
  }
});