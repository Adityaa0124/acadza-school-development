var express = require("express");
var router = express.Router();
var { basicAuth } = require("../utils/auth");

// Require the controllers
var user_controller = require("../controllers/user");

router.post("/login", user_controller.login);
router.post("/register", user_controller.register);

/* New routes for phone otp while registration */
router.post("/register/phoneotp", user_controller.registration_phone_otp);
router.post("/register/phoneotp/verify", user_controller.registration_phone_otp_verify);
/* New routes for phone otp while registration */

router.post("/details", basicAuth, user_controller.user_details);

module.exports = router;
