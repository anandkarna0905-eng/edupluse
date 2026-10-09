const Student = require("../models/Student");
const { calculateRisk, getRiskReasons } = require("../utils/riskCalculator");

exports.getStudents = async (req, res, next) => {
  try {
    const { search, risk } = req.query;
    const filter = {};

    if (risk && ["Low", "Medium", "High"].includes(risk)) filter.riskLevel = risk;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } }
      ];
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { studentId, name, department, year, attendance, marks, notes = "" } = req.body;
    const student = await Student.create({
      studentId,
      name,
      department,
      year: Number(year),
      attendance: Number(attendance),
      marks: Number(marks),
      notes,
      riskLevel: calculateRisk(Number(attendance), Number(marks))
    });
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "That student ID already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, data: student, reasons: getRiskReasons(student) });
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.attendance !== undefined) updates.attendance = Number(updates.attendance);
    if (updates.marks !== undefined) updates.marks = Number(updates.marks);
    if (updates.year !== undefined) updates.year = Number(updates.year);

    const current = await Student.findById(req.params.id);
    if (!current) return res.status(404).json({ success: false, message: "Student not found" });

    const attendance = updates.attendance ?? current.attendance;
    const marks = updates.marks ?? current.marks;
    updates.riskLevel = calculateRisk(attendance, marks);

    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, data: student });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "That student ID already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, message: "Student deleted" });
  } catch (error) {
    next(error);
  }
};