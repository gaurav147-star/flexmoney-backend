const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, "secret_key", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const { userId } = decoded;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      req.userId = userId; // Attach userId to the request object for further processing
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

module.exports = verifyToken;
