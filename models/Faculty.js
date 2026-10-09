const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  department: { type: String, trim: true, default: "Academic Team" }
}, { timestamps: true });

module.exports = mongoose.model("Faculty", facultySchema);
