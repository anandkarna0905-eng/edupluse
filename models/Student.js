const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 1,
      max: 6
    },
    attendance: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);