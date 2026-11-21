const jwt = require("jsonwebtoken");
const User = require("../models/user");

/*
 * The bearer-token middleware of acadza-backend: the token is read from
 * `Authorization: Bearer <token>`, verified against TOKEN_SECRET, the decoded payload is
 * attached as `req.user`, and the account's `lastActive` is stamped on the way through.
 *
 * The single-device session check acadza-backend also runs here is not part of this project —
 * there is no recorded-course session store to ask — so a valid token is accepted as it stands.
 */
const basicAuth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    req.user = decoded;
    try {
      const user = await User.findByIdAndUpdate(decoded.id, { lastActive: new Date() });
      if (!user) return res.status(401).json({ message: "Account not found" });
      return next();
    } catch (error) {
      return res.status(503).json({ message: "Unable to verify your session. Please retry." });
    }
  });
};

module.exports = { basicAuth };
