const mongoose = require("mongoose");

const interventionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"]
    },
    title: {
      type: String,
      required: [true, "Intervention title is required"],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    dueDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "Planned"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Intervention", interventionSchema);