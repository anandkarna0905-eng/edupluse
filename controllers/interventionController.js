const Intervention = require("../models/Intervention");
const Student = require("../models/Student");

exports.getInterventions = async (req, res, next) => {
  try {
    const items = await Intervention.find()
      .populate("student", "name studentId department riskLevel")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

exports.createIntervention = async (req, res, next) => {
  try {
    const { student, title, description = "", dueDate = null, status = "Planned" } = req.body;
    const exists = await Student.findById(student);
    if (!exists) return res.status(404).json({ success: false, message: "Selected student not found" });

    const item = await Intervention.create({ student, title, description, dueDate: dueDate || null, status });
    await item.populate("student", "name studentId department riskLevel");
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.updateIntervention = async (req, res, next) => {
  try {
    const item = await Intervention.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("student", "name studentId department riskLevel");

    if (!item) return res.status(404).json({ success: false, message: "Intervention not found" });
    res.json({ success: true, data: item });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.deleteIntervention = async (req, res, next) => {
  try {
    const item = await Intervention.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Intervention not found" });
    res.json({ success: true, message: "Intervention deleted" });
  } catch (error) {
    next(error);
  }
};