// Path: backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler"); // Simple middleware for handling exceptions inside of async express routes
const User = require("../models/user"); // Import the User model

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (without password) to the request object
      // This allows us to access req.user in our controllers
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token is provided
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

// Middleware for role-based authorization (example)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      // Assuming a 'role' field in User model
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
