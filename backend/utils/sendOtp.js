/*
 * Stands in for acadza-backend's SMS provider.
 *
 * There, `sendOTP(phone, code, validity, cb)` hands the code to Twilio and the controller only
 * writes the TempUser row once the provider has accepted it. The signature and the callback
 * contract are kept identical so the controller reads the same; only the delivery changes — the
 * code goes to the server console. Wire a provider in here and nothing above it has to move.
 *
 * OTP_DEV_CODE, when set, overrides the random code: that is what makes the signup screen
 * testable without a phone in hand. Leave it unset and a fresh 6-digit code is generated.
 */
const sendOTP = (phone, code, validity, callback) => {
  if (!phone) {
    return callback(new Error("phone missing"));
  }

  console.log(`[OTP] ${phone} -> ${code} (valid ${validity})`);
  return callback(null, { phone, delivered: true });
};

const otpCode = () => process.env.OTP_DEV_CODE || ("" + Math.random()).substring(2, 8);

module.exports = { sendOTP, otpCode };
