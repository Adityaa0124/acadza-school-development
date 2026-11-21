const express = require("express");
const router = express.Router();
const { adminAuth } = require("../utils/auth");
const admin_controller = require("../controllers/admin");

// Admin Dashboard stats
router.get("/stats", adminAuth, admin_controller.stats);
router.post("/stats", adminAuth, admin_controller.stats);

// User directory listing with search & filters
router.get("/users", adminAuth, admin_controller.get_users);
router.post("/users", adminAuth, admin_controller.get_users);

// User management actions
router.post("/user/update-role", adminAuth, admin_controller.update_user_role);
router.post("/user/toggle-block", adminAuth, admin_controller.toggle_block_user);
router.post("/user/delete", adminAuth, admin_controller.delete_user);
router.post("/user/create", adminAuth, admin_controller.create_user);

module.exports = router;
