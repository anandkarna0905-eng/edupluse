const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Intervention = require("../models/Intervention");
const { getRiskReasons } = require("../utils/riskCalculator");

exports.studentLogin = async (req, res, next) => {
  try {
    const rollNo = String(req.body.rollNo || "").trim();
    if (!rollNo) return res.status(400).json({ success: false, message: "Please enter your roll number." });
    const student = await Student.findOne({ studentId: { $regex: `^${escapeRegex(rollNo)}$`, $options: "i" } });
    if (!student) return res.status(404).json({ success: false, message: "That roll number was not found. Please check it or contact your faculty." });
    const interventions = await Intervention.find({ student: student._id }).sort({ createdAt: -1 }).select("title description dueDate status createdAt");
    res.json({ success: true, data: student, reasons: getRiskReasons(student), interventions });
  } catch (error) { next(error); }
};

exports.facultyLogin = async (req, res, next) => {
  try {
    const userId = String(req.body.userId || "").trim().toUpperCase();
    if (!userId) return res.status(400).json({ success: false, message: "Please enter your faculty User ID." });
    const faculty = await Faculty.findOne({ userId });
    if (!faculty) return res.status(404).json({ success: false, message: "Faculty User ID not found. Ask the administrator to add your account." });
    res.json({ success: true, data: { userId: faculty.userId, name: faculty.name, department: faculty.department } });
  } catch (error) { next(error); }
};

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
