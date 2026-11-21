# frontend

Login and register only, following the same flow as `student-frontend`. Next.js pages router, Tailwind, redux, cookie-held session.

## Layout, kept recognisable

```
pages/login/index.js      -> components/Authentication/Login
pages/signup/index.js     -> components/Authentication/Signup
pages/dashboard/index.js  the one page behind the sign-in
context/auth/authProvider.js   login(), logout(), the three cookies
utils/axios.js            the shared instance, base URL + bearer token
utils/constants/...       api_routes/auth, cookies, page_routes, course_mode, screen_size
```

Path aliases (`@components/*`, `@context/*`, `@utils/*`, `@redux/*`, `@hooks/*`, `@styles/*`) are the same ones, in `jsconfig.json`.

## The session is three cookies, not one

| Cookie | Holds |
|---|---|
| `A_USER` | the cached account, so a reload paints the dashboard without a round trip |
| `A_TOKEN` | the bearer token every request carries |
| `A_AUTHTOKEN` | **"this session is usable"** — a token alone is not enough; the account must also have a verified email or phone |

`A_AUTHTOKEN` is the one the screens watch. It has three states and all three matter: `null` means the cookie has not been read yet and the page waits, `false` sends the visitor to `/login`, `true` renders. Treating `null` as "not signed in" bounces a signed-in student out on every hard refresh.

Both `authProvider` and the redux reducer strip `password` and `ipList` on the way in (`utils/functions/safe_user.js`). A cookie is sent to the server on every single request, so a password kept there would travel with every call the site makes — this backend never returns one, so it is belt and braces, but it is the one door every caller goes through.

## Login

One field for the identifier — username, email or mobile, matched against all three server-side — and a password. The autofill attributes on those two inputs (`name`, `id`, `autocomplete="username"` / `"current-password"`) are load-bearing, not polish: without them Chrome cannot classify the form locally and falls back to heuristics before it will offer a saved password.

On success `login()` writes the three cookies and the screen leaves for `/dashboard`, which greets with **"Welcome to dashboard"** and the account's details. A failure is a 200 from the API with a message meant to be shown as it is, so "User not found" and "Incorrect password" reach the field directly.

## Register — three steps

1. **Mobile number and class (6–12)** → `POST /user/register/phoneOtp`. The course is not asked for — every account registered here is a JEE account. Ten digits *or* an email is a complete entry; the 6–9 first-digit rule belongs to submit so it can explain itself.
2. **The six-digit code** → `POST /user/register/phoneOtp/verify`. Focus advances on entry and retreats on Backspace, a pasted code fills all six boxes, and the countdown is one interval for the life of the component — recreated per render it would stall for as long as the student was typing. The countdown is a drawing, not the rule: the real lifetime is whatever the server set.
3. **Name, email, password** → `POST /user/register`, then **straight into `login()`** with the credentials just set. Registration hands back no token; one place issues sessions, so a student who signs up ends up in exactly the state a student who logged in is.

`"username already exists !"` from the API is rewritten to "You already have an account, Login to use Acadza" — the raw string is developer wording and gives no hint that the fix is to log in rather than retry.

## Running it

```bash
cp .env.local.example .env.local
npm install
npm run dev              # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` points at the backend of this repo (`http://localhost:4000`). It is read at build time, so changing it needs a restart of `next dev`.

Start the backend first — signup's very first step is a request to it.

## Deliberately left out

Google / Facebook / Apple / WhatsApp buttons, phone-OTP *login*, forgot-password, the white-label coaching and partner (`?ref=arihant`, `RESONANCE`, …) branches, theme and language providers, redux-persist. The illustration panel keeps the reference's `showImage` prop but draws a caption, since no image assets ship here — dropping real artwork in means changing only `components/Authentication/CommonScreen`.
