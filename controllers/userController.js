const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

exports.loginUser = async (req, res) => {
  try {
    const { username, password, citizenship } = req.body;

    console.log("Login attempt received:", req.body); // ✅ log incoming credentials

    let user;

    if (username && password) {
      // Admin login
      user = await User.findOne({ username, role: "admin" });
      console.log("Found admin user:", user); // ✅ log user from DB

      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const isMatch = await user.comparePassword(password);
      console.log("Password match result:", isMatch); // ✅ log password comparison

      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    } else if (citizenship) {
      // Voter login
      user = await User.findOne({ citizenship, role: "voter" });
      console.log("Found voter user:", user); // ✅ log user from DB

      if (!user) return res.status(401).json({ message: "Invalid citizenship number" });

    } else {
      return res.status(400).json({ message: "Missing login credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
  { id: user._id, role: user.role, citizenship: user.role === "voter" ? user.citizenship : undefined }, 
  JWT_SECRET, 
  { expiresIn: "5m" } // for testing, 5 minutes; production: "1d"
);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        citizenship: user.citizenship,
        name: user.name
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
