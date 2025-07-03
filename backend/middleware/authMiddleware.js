const jwt = require("jsonwebtoken");

// General-purpose token verifier with role check
const verifyToken = (req, res, next, expectedRole) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token role matches the route's required role
    if (expectedRole && decoded.role !== expectedRole) {
      return res.status(403).json({ message: "Forbidden: Role mismatch" });
    }

    // ✅ Attach decoded user info to req.user and role-specific field
    if (decoded.role === "admin") {
      req.admin = decoded;
      req.user = decoded;
    }
    if (decoded.role === "staff") {
      req.staff = decoded;
      req.user = decoded;
    }
    if (decoded.role === "client") {
      req.client = decoded;
      req.user = decoded;
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware wrappers for each role
const protectAdmin = (req, res, next) => verifyToken(req, res, next, "admin");
const protectStaff = (req, res, next) => verifyToken(req, res, next, "staff");
const protectClient = (req, res, next) => verifyToken(req, res, next, "client");

// Generic version without role check (if needed)
const protectAny = (req, res, next) => verifyToken(req, res, next, null);

module.exports = {
  protectAdmin,
  protectStaff,
  protectClient,
  protectAny,
};
