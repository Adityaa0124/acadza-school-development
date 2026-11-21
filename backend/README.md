# backend

Login and register only, following the same flow as `acadza-backend`.

## What it carries over

| | |
|---|---|
| Routes | `POST /user/register/phoneotp`, `POST /user/register/phoneotp/verify`, `POST /user/register`, `POST /user/login`, `POST /user/details` |
| Response shape | `{ isSuccessful, message, user, token }` — a failure is a **200** with `isSuccessful: false` and a message meant to be shown as it is |
| Token | JWT over `{ id, role }`, signed with `TOKEN_SECRET`, 20-day life, read from `Authorization: Bearer <token>` |
| Layout | `app.js` → `routes/user.js` → `controllers/user.js`, with `utils/auth.js` holding `basicAuth` |
| Records | `User` (+ `username` as `Acadza-User-N`, `referralCode`, `planType: "silver"`, `course: "JEE"`), `TempUser` (the OTP holding record, 30-minute TTL), `LoginTrack` |

## The register flow, in order

1. **`POST /user/register/phoneotp`** `{ phone }` — sends a six-digit code and upserts a `TempUser` row for that number with ten attempts.
2. **`POST /user/register/phoneotp/verify`** `{ phone, otp }` — marks the row `phoneVerified`. A wrong code costs one attempt; wrong and expired return the same message.
3. **`POST /user/register`** — refuses any phone without a verified `TempUser` row (`"user not verified !"`), and any phone or email that already belongs to a verified account (`"username already exists !"` — the string the frontend matches on to say "You already have an account"). An unverified half-finished record is completed rather than duplicated.

Registration does **not** return a token. The frontend logs the new account in through `POST /user/login` straight afterwards, so one endpoint issues every session.

## Two deliberate differences from acadza-backend

- **Passwords are hashed.** The reference stores the password as typed and compares strings; this hashes with bcrypt on register and compares on login. Nothing a client sees changes. A plaintext value copied in from the old database still logs in and is upgraded to a hash on the way through.
- **The OTP is printed to the server console**, not sent over SMS — there is no provider wired here. `utils/sendOtp.js` keeps the reference's `sendOTP(phone, code, validity, cb)` signature, so wiring one in touches only that file. `OTP_DEV_CODE` in `.env` fixes the code (`123456`) so signup is testable without a phone.

Not carried over, because the features they belong to are not in this project: Google/Facebook/WhatsApp login, the single-device session check, the welcome email, and the partner (stepapp, Arihant, Resonance) branches.

## Running it

```bash
cp .env.example .env     # then set TOKEN_SECRET to something long and random
npm install
npm run dev              # http://localhost:4000
```

Needs MongoDB on `MONGO_DEV_URI` (default `mongodb://127.0.0.1:27017/acadza-schools`).

`PORT` defaults to **4000**, not 5000: on macOS the AirPlay Receiver in Control Centre already listens on 5000.

## Checking it by hand

```bash
B=http://localhost:4000
curl -s -X POST $B/user/register/phoneOtp -H 'Content-Type: application/json' \
  -d '{"phone":"9876500011"}'
curl -s -X POST $B/user/register/phoneOtp/verify -H 'Content-Type: application/json' \
  -d '{"phone":"9876500011","otp":"123456"}'
curl -s -X POST $B/user/register -H 'Content-Type: application/json' \
  -d '{"name":"Test Student","email":"test.student@example.com","phone":"9876500011","password":"secret123","course":"JEE"}'
curl -s -X POST $B/user/login -H 'Content-Type: application/json' \
  -d '{"username":"test.student@example.com","password":"secret123"}'
```
