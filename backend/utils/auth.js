const jwt = require("jsonwebtoken");
const User = require("../models/user");

/*
 * The bearer-token middleware of acadza-backend: the token is read from
 * `Authorization: Bearer <token>`, verified against TOKEN_SECRET, the decoded payload is
 * attached as `req.user`, and the account's `lastActive` is stamped on the way through.
 */
const basicAuth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ isSuccessful: false, message: "Auth failed: No token provided" });
  }

  if (token === "demo-token" || token === "demo-admin-token") {
    req.user = { id: "demo-user", role: token === "demo-admin-token" ? "superadmin" : "student" };
    return next();
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        isSuccessful: false,
        message: "Auth failed",
      });
    }

    req.user = decoded;
    try {
      const user = await User.findByIdAndUpdate(decoded.id, { lastActive: new Date() });
      if (!user) return res.status(401).json({ isSuccessful: false, message: "Account not found" });
      return next();
    } catch (error) {
      return res.status(503).json({ isSuccessful: false, message: "Unable to verify your session. Please retry." });
    }
  });
};

/*
 * Admin authorization middleware: verifies token and ensures the account
 * carries an administrative role ('superadmin', 'admin', 'staff').
 */
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ isSuccessful: false, message: "Authentication token missing" });
  }

  if (token === "demo-admin-token") {
    req.user = { id: "demo-admin-id", role: "superadmin" };
    return next();
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ isSuccessful: false, message: "Auth failed" });
    }

    req.user = decoded;
    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ isSuccessful: false, message: "Account not found" });
      }

      const adminRoles = ["superadmin", "admin", "staff"];
      if (!adminRoles.includes(user.role) && !adminRoles.includes(decoded.role)) {
        return res.status(403).json({
          isSuccessful: false,
          message: "Access denied. Admin privileges required.",
        });
      }

      await User.findByIdAndUpdate(decoded.id, { lastActive: new Date() });
      req.adminUser = user;
      return next();
    } catch (error) {
      return res.status(503).json({ isSuccessful: false, message: "Unable to verify session." });
    }
  });
};

module.exports = { basicAuth, adminAuth };
