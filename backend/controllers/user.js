const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const User = require("../models/user");
const TempUser = require("../models/tempUser");
const LoginTrack = require("../models/loginTrack");
const { sendOTP, otpCode } = require("../utils/sendOtp");

/*
 * ONE DELIBERATE DIFFERENCE FROM acadza-backend, AND IT IS IN HERE.
 *
 * There, the password is stored as the student typed it and login is a string comparison
 * (`user.password == req.body.password`). This project hashes with bcrypt on register and
 * compares with bcrypt on login. Nothing a client sees changes — same endpoints, same request
 * bodies, same response shapes — but a dump of this database does not hand over every password,
 * and the account's readable password can no longer travel back to the browser in the login
 * response the way the frontend's own comments describe having to strip out.
 *
 * `comparePassword` accepts a legacy plaintext value as well, so a record copied in from the
 * old database still logs in and is silently upgraded to a hash on the way through.
 */
const hashPassword = async (plain) => bcrypt.hash(String(plain), 10);

const comparePassword = async (plain, stored) => {
  if (!stored) return { ok: false, legacy: false };
  if (/^\$2[aby]\$/.test(stored)) {
    return { ok: await bcrypt.compare(String(plain), stored), legacy: false };
  }
  return { ok: stored === String(plain), legacy: true };
};

// The payload acadza-backend signs — id and role, nothing else — with the same 20-day life.
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: "20d" });

// What goes back to the client. `password` is never part of it, exactly as in the reference.
const publicUser = (user) => {
  const plain = user.toObject ? user.toObject() : { ...user };
  delete plain.password;
  return plain;
};

/* ------------------------------------------------------------------ *
 * STEP 1 of signup: send the registration OTP.                        *
 * POST /user/register/phoneotp   { phone }                            *
 * ------------------------------------------------------------------ */
exports.registration_phone_otp = async (req, res) => {
  try {
    const phone = req.body.phone;
    if (!phone) {
      return res.json({ isSuccessful: false, message: "phone missing" });
    }

    const randStr = otpCode();

    sendOTP(phone, randStr, "5 minutes", async (error) => {
      if (error) {
        console.log("ERROR", error);
        return res.status(500).json({ message: "Internal error" });
      }

      try {
        /*
         * `count: 10` is reset on every send, as in the reference: the ten attempts belong to
         * the code, not to the phone number, so a resend is a clean slate.
         */
        await TempUser.findOneAndUpdate(
          { phone },
          { phoneOtp: randStr, count: 10, phoneVerified: false },
          { upsert: true, new: true }
        );

        return res.json({
          isSuccessful: true,
          message: "OTP sent successfully!!",
        });
      } catch (err) {
        return res.status(400).json({
          type: "error",
          isSuccessful: false,
          message: "Sorry, Your OTP may have expired.",
        });
      }
    });
  } catch (err) {
    console.log("Error in registration phone otp: ", err);
    res.status(500).json({ isSuccessful: false, message: "Internal error" });
  }
};

/* ------------------------------------------------------------------ *
 * STEP 2 of signup: verify it.                                        *
 * POST /user/register/phoneotp/verify   { phone, otp }                *
 * ------------------------------------------------------------------ */
exports.registration_phone_otp_verify = async (req, res) => {
  try {
    const phoneOtp = req.body.otp;
    const phone = req.body.phone;

    const tempUser = await TempUser.findOne({ phone, phoneOtp });

    if (tempUser) {
      if (tempUser.count <= 0) {
        return res.status(400).json({
          isSuccessful: false,
          message: "Invalid OTP, please try again!!",
        });
      }
      tempUser.phoneVerified = true;
      await tempUser.save();

      return res.json({
        isSuccessful: true,
        message: "Mobile OTP verified successfully!!",
      });
    }

    // A wrong code costs one of the ten attempts. Same message for wrong and for expired.
    await TempUser.updateMany({ phone }, { $inc: { count: -1 } });

    return res.status(400).json({
      isSuccessful: false,
      message: "Invalid OTP, please try again!!",
    });
  } catch (err) {
    console.log("Error occurred in mobile OTP verification: ", err);
    res.status(400).json({
      isSuccessful: false,
      message: "Error occurred in mobile OTP verification",
    });
  }
};

/* ------------------------------------------------------------------ *
 * STEP 3 of signup: create the account.                               *
 * POST /user/register                                                 *
 * ------------------------------------------------------------------ */
exports.register = async (req, res) => {
  try {
    // Duplicate check: by email when one was sent, by phone otherwise — the reference's rule.
    let query = {};
    if (req.body.email) {
      query = { email: req.body.email };
    } else {
      query = { phone: req.body.phone };
    }

    const userExist = await User.findOne(query);
    if (userExist) {
      /*
       * An existing record whose phone was never verified is NOT a duplicate: the student
       * abandoned the flow half-way and is finishing it now. Only a verified one blocks, and
       * the message is the exact string the frontend matches on to say "You already have an
       * account, Login to use Acadza".
       */
      if (userExist.phoneVerified) {
        console.log("username already exists !");
        return res.json({
          isSuccessful: false,
          message: "username already exists !",
          user: null,
        });
      }
    }

    // No verified OTP, no account. This is what makes step 1 and 2 above load-bearing.
    const userVerification = await TempUser.findOne({ phone: req.body.phone });
    if (!userVerification || !userVerification.phoneVerified) {
      return res.status(401).json({
        isSuccessful: false,
        message: "user not verified !",
        user: null,
      });
    }

    const totalUsers = await User.countDocuments({});

    if (userExist) {
      // Finish the abandoned record rather than leaving a second one next to it.
      userExist.name = req.body.name || userExist.name;
      userExist.email = req.body.email || userExist.email;
      userExist.password = await hashPassword(req.body.password);
      userExist.emailVerified = userVerification.emailVerified;
      userExist.phoneVerified = userVerification.phoneVerified;
      const saved = await userExist.save();

      await LoginTrack.updateOne({ user: saved._id }, { email: saved.email }, { upsert: true });

      return res.json({
        isSuccessful: true,
        message: "User registered successfully",
        user: publicUser(saved),
      });
    }

    const newUser = new User({
      name: req.body.name,
      username: `Acadza-User-${totalUsers + 1}`,
      email: req.body.email,
      role: req.body.role || "student",
      password: await hashPassword(req.body.password),
      city: req.body.city,
      phone: req.body.phone,
      language: req.body.language,
      course: req.body.course ? req.body.course : "JEE",
      signupMode: req.body.signupMode ? req.body.signupMode : "Normal",
      signupCoupon: req.body.signupCoupon ? req.body.signupCoupon : "",
      emailVerified: userVerification.emailVerified,
      phoneVerified: userVerification.phoneVerified,
      referralCode: `${shortid.generate()}${totalUsers + 1}`,
      programme: req.body.programme,
      orionClass: req.body.orionClass ? req.body.orionClass : -1,
      reference: req.body.reference,
      meta: req.body.meta ? req.body.meta : {},
    });

    const user = await newUser.save();

    await LoginTrack.updateOne({ user: user._id }, { email: user.email }, { upsert: true });

    /*
     * The reference also renders and sends a welcome mail here. There is no mail transport in
     * this project, so the response is returned directly — the frontend only reads
     * `isSuccessful` before logging the student in, so the shape is what matters.
     */
    return res.json({
      isSuccessful: true,
      message: "User registered successfully",
      user: publicUser(user),
    });
  } catch (err) {
    console.log("ERROR", err);
    res.json({
      isSuccessful: false,
      message: "Error in user register",
      err: err.message,
    });
  }
};

/* ------------------------------------------------------------------ *
 * POST /user/login   { username, password }                           *
 *                                                                     *
 * `username` is whatever the student typed into one field — their      *
 * username, their email or their phone — matched against all three,    *
 * with the email lower-cased. Straight from the reference.             *
 * ------------------------------------------------------------------ */
exports.login = async (req, res) => {
  try {
    const username = req.body.username;
    if (!username) {
      return res.json({
        isSuccessful: false,
        message: "User not found",
        user: null,
      });
    }

    let user = await User.findOne({
      $or: [{ username: username }, { email: String(username).toLowerCase() }, { phone: username }],
    }).lean();

    if (!user) {
      return res.json({
        isSuccessful: false,
        message: "User not found",
        user: null,
      });
    }

    if (!user.password) {
      // Kept because the frontend's login screen renders this message as it is.
      return res.json({
        isSuccessful: false,
        message: "Please login through GMail/Facebook login",
        user: null,
      });
    }

    const { ok, legacy } = await comparePassword(req.body.password, user.password);
    if (!ok) {
      return res.json({
        isSuccessful: false,
        message: "Incorrect password",
        user: null,
      });
    }

    const userUpdateObj = {};

    // A plaintext password copied in from the old database is upgraded on first use.
    if (legacy) {
      userUpdateObj.password = await hashPassword(req.body.password);
    }

    if (req.body.deviceId) {
      user.deviceId = req.body.deviceId;
      user.deviceType = req.body.deviceType || "android";
      userUpdateObj.deviceId = req.body.deviceId;
      userUpdateObj.deviceType = req.body.deviceType || "android";
    }

    if (Object.keys(userUpdateObj).length > 0) {
      await User.findByIdAndUpdate(user._id, { $set: userUpdateObj });
    }

    await LoginTrack.updateOne({ user: user._id }, { email: user.email }, { upsert: true });

    user.password = undefined;

    const token = signToken(user);

    return res.json({
      isSuccessful: true,
      message: "Login success",
      user: user,
      token: token,
    });
  } catch (err) {
    console.log("Error in login: ", err);
    return res.json({
      isSuccessful: false,
      message: "Error in user login",
      user: null,
    });
  }
};

/* ------------------------------------------------------------------ *
 * POST /user/details  (behind basicAuth)                              *
 *                                                                     *
 * What the frontend's `loadUserData()` calls once a day to refresh the *
 * cached account. It answers with the user object at the top level,    *
 * not wrapped — that is the shape the caller reads.                    *
 * ------------------------------------------------------------------ */
exports.user_details = async (req, res) => {
  try {
    // The token's own id wins over the body's, so one account cannot ask for another's record.
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = undefined;
    return res.json(user);
  } catch (err) {
    console.log("Error in user details: ", err);
    return res.status(500).json({ message: "Error in user details" });
  }
};
