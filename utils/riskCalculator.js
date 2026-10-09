// Demo rule-based indicator, not a validated prediction model.
function calculateRisk(attendance, marks) {
  if (attendance < 60 || marks < 40) return "High";
  if (attendance < 75 || marks < 60) return "Medium";
  return "Low";
}

function getRiskReasons(student) {
  const reasons = [];
  if (student.attendance < 75) reasons.push(`Attendance is ${student.attendance}%`);
  if (student.marks < 60) reasons.push(`Marks are ${student.marks}/100`);
  if (reasons.length === 0) reasons.push("Attendance and marks are currently within the demo thresholds");
  return reasons;
}

module.exports = { calculateRisk, getRiskReasons };