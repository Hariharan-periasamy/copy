const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Attendance } = require("../models"); // Replace with actual model imports
const router = express.Router();

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "123";
const SECRET_KEY = "secretkey"; // Replace with environment variables in production

// User Registration
router.post("/register", async (req, res) => {
  const { name, email, password, department, phone } = req.body;
  if (!name || !email || !password || !department  || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      department,
      phone
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user is an admin
    if (email === ADMIN_EMAIL) {
      if (password === ADMIN_PASSWORD) {
        // Generate an admin token
        const token = jwt.sign(
          { userId: "admin", department: "admin" },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        return res.json({
          token,
          user: { name: "Admin", department: "admin" },
        });
      } else {
        return res.status(400).json({ message: "Invalid admin credentials" });
      }
    }

    // Check if the user is a regular user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate a user token
    const token = jwt.sign(
      { userId: user._id, department: user.department },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { name: user.name, department: user.department } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Check-In
router.post("/attendance", async (req, res) => {
  const { employeeID, name, date, timeIn, attendance, status } = req.body;
  try {
    const existingRecord = await Attendance.findOne({ employeeID, date });
    if (existingRecord) return res.status(400).json({ message: "Check-In already exists for today" });

    const newAttendance = new Attendance({ employeeID, name, date, timeIn, attendance, status });
    await newAttendance.save();
    res.status(201).json({ message: "Check-In successful", record: newAttendance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Check-Out
router.put("/attendance/:id", async (req, res) => {
  const { timeOut } = req.body;
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Attendance record not found" });

    record.timeOut = timeOut;
    await record.save();
    res.json({ message: "Check-Out successful", record });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Get All Attendance Records
router.get("/attendance/all", async (req, res) => {
  try {
    const records = await Attendance.find({});
    res.json(records);
  } catch (error) {
    console.error("Error fetching all attendance records:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch Attendance by Employee and Date
router.get("/attendance", async (req, res) => {
  const { employeeID, date } = req.query;

  try {
    if (!employeeID || !date) {
      return res.status(400).json({ message: "Employee ID and date are required" });
    }

    const record = await Attendance.findOne({ employeeID, date });
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json(record);
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// After removing authenticate
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Dashboard Data
router.get("/dashboard", async (req, res) => {
  try {
    // Get total employees
    const totalEmployees = await User.countDocuments();

    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Count employees who were on time today
    const onTimeToday = await Attendance.countDocuments({
      date: today,
      status: "On Time",
    });

    res.json({ totalEmployees, onTimeToday });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router; 