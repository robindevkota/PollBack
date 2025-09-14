const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

exports.authMiddleware = (req, res, next) => {
  // Check Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Expect: "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded payload to request
    next();             // Proceed to the route
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
