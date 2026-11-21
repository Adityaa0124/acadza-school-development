# acadza-schools

Two projects, login and register only.

- **[backend/](backend)** — Express + MongoDB, the register/login flow of `acadza-backend` (phone-OTP gate → register → JWT login).
- **[frontend/](frontend)** — Next.js, the login/signup screens of `student-frontend`, landing on a dashboard that says **Welcome to dashboard**.

## Start both

```bash
# terminal 1 — needs MongoDB running
cd backend && cp .env.example .env   # set TOKEN_SECRET
npm install && npm run dev           # http://localhost:4000

# terminal 2
cd frontend && cp .env.local.example .env.local
npm install && npm run dev           # http://localhost:3000
```

Then open <http://localhost:3000/signup>. The registration OTP is **printed to the backend console**; with `OTP_DEV_CODE=123456` in `backend/.env` it is always `123456`.

Each project's README has the detail: what was carried over from the reference repo, what was deliberately left out, and the two places this backend differs from `acadza-backend` (passwords are bcrypt-hashed; the OTP goes to the console rather than over SMS).
