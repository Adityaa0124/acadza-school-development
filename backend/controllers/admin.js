const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const User = require("../models/user");
const LoginTrack = require("../models/loginTrack");

const hashPassword = async (plain) => bcrypt.hash(String(plain), 10);

const publicUser = (user) => {
  const plain = user.toObject ? user.toObject() : { ...user };
  delete plain.password;
  return plain;
};

/* ------------------------------------------------------------------ *
 * GET/POST /admin/stats                                               *
 * Key analytics for the admin dashboard                               *
 * ------------------------------------------------------------------ */
exports.stats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalStaff = await User.countDocuments({
      role: { $in: ["admin", "superadmin", "staff", "teacher"] },
    });
    const totalVerified = await User.countDocuments({
      $or: [{ phoneVerified: true }, { emailVerified: true }],
    });

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select("-password")
      .lean();

    return res.json({
      isSuccessful: true,
      message: "Admin stats retrieved successfully",
      stats: {
        totalUsers,
        totalStudents,
        totalStaff,
        totalVerified,
        recentUsers,
      },
    });
  } catch (err) {
    console.error("Error in admin stats:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to fetch admin stats",
      error: err.message,
    });
  }
};

/* ------------------------------------------------------------------ *
 * GET/POST /admin/users                                               *
 * Paginated and searchable users list                                 *
 * ------------------------------------------------------------------ */
exports.get_users = async (req, res) => {
  try {
    const search = (req.query.search || req.body.search || "").trim();
    const role = req.query.role || req.body.role;
    const page = Math.max(1, parseInt(req.query.page || req.body.page || 1, 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || req.body.limit || 10, 10)));

    const query = {};

    if (role && role !== "all") {
      query.role = role;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { username: regex },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password")
      .lean();

    return res.json({
      isSuccessful: true,
      users,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    console.error("Error in admin get_users:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

/* ------------------------------------------------------------------ *
 * POST /admin/user/update-role                                        *
 * Change user role (student, teacher, staff, admin, superadmin)       *
 * ------------------------------------------------------------------ */
exports.update_user_role = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const allowedRoles = ["student", "teacher", "staff", "admin", "superadmin"];

    if (!userId || !role) {
      return res.json({ isSuccessful: false, message: "User ID and role are required" });
    }

    if (!allowedRoles.includes(role)) {
      return res.json({
        isSuccessful: false,
        message: `Invalid role. Allowed: ${allowedRoles.join(", ")}`,
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.json({ isSuccessful: false, message: "User not found" });
    }

    return res.json({
      isSuccessful: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (err) {
    console.error("Error in update_user_role:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to update user role",
      error: err.message,
    });
  }
};

/* ------------------------------------------------------------------ *
 * POST /admin/user/toggle-block                                       *
 * Block or unblock an account                                         *
 * ------------------------------------------------------------------ */
exports.toggle_block_user = async (req, res) => {
  try {
    const { userId, isBlocked } = req.body;

    if (!userId || typeof isBlocked === "undefined") {
      return res.json({ isSuccessful: false, message: "User ID and isBlocked are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isBlocked: Boolean(isBlocked) } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.json({ isSuccessful: false, message: "User not found" });
    }

    return res.json({
      isSuccessful: true,
      message: `User account ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (err) {
    console.error("Error in toggle_block_user:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to toggle block status",
      error: err.message,
    });
  }
};

/* ------------------------------------------------------------------ *
 * POST /admin/user/delete                                             *
 * Permanently remove user account                                     *
 * ------------------------------------------------------------------ */
exports.delete_user = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ isSuccessful: false, message: "User ID is required" });
    }

    if (req.user && req.user.id === userId) {
      return res.json({ isSuccessful: false, message: "You cannot delete your own admin account" });
    }

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.json({ isSuccessful: false, message: "User not found" });
    }

    await LoginTrack.deleteMany({ user: userId });

    return res.json({
      isSuccessful: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error in delete_user:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to delete user",
      error: err.message,
    });
  }
};

/* ------------------------------------------------------------------ *
 * POST /admin/user/create                                             *
 * Create a user with specified role directly                          *
 * ------------------------------------------------------------------ */
exports.create_user = async (req, res) => {
  try {
    const { name, email, phone, password, role = "student", course = "JEE", planType = "silver" } = req.body;

    if (!name || !email || !password) {
      return res.json({ isSuccessful: false, message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({
      $or: [{ email: String(email).toLowerCase() }, ...(phone ? [{ phone }] : [])],
    });

    if (existing) {
      return res.json({ isSuccessful: false, message: "A user with this email or phone already exists" });
    }

    const totalUsers = await User.countDocuments();
    const newUser = new User({
      name,
      username: `Acadza-User-${totalUsers + 1}`,
      email: String(email).toLowerCase(),
      phone: phone || "",
      password: await hashPassword(password),
      role,
      course,
      planType,
      emailVerified: true,
      phoneVerified: Boolean(phone),
      referralCode: `${shortid.generate()}${totalUsers + 1}`,
      signupMode: "AdminCreated",
    });

    const user = await newUser.save();

    return res.json({
      isSuccessful: true,
      message: "User created successfully",
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Error in create_user:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to create user",
      error: err.message,
    });
  }
};
