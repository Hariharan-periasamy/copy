const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  dob: { type: Date },
  department: {
    type: String,
    enum: ["frontend", "backend", "UI/UX", "Digital Marketing"],
    required: true,
  },
  password: { type: String, required: true },
});

// Attendance Schema
const attendanceRecords = new mongoose.Schema({
  employeeID: { type: String, required: true }, // Ensure this field is stored
  name: { type: String, required: true },
  date: { type: String, required: true },
  attendance: { type: String, required: true },
  status: { type: String, enum: ["On Time", "Late"], required: true },
  timeIn: { type: String, required: true },
  timeOut: { type: String },
});



// Export both models
const User = mongoose.model("User", userSchema);
const Attendance = mongoose.model("Attendance", attendanceRecords);

module.exports = { User, Attendance };
