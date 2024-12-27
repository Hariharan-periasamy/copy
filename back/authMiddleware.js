const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretkey";

const authMiddleware = (req, res, next) => {
    const taken = localStorage.getItem("taken");
  const token = req.headers["authorization"]?.split(" ")[1]; 

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); 
    req.user = decoded;
    next(); 
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
