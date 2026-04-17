## Stripe setup (Option A: subscription + 7‑day trial for Adventure Academy)

This project uses **Stripe Checkout (hosted page)** + the **Stripe Node SDK**.

### 1) Create a Product + recurring Price in Stripe

- Create a **Product** called something like “Safety Pass”.
- Add a **recurring Price** (monthly or yearly).
- Copy the **Price ID** (looks like `price_...`).

### 2) Add environment variables

In Vercel (and in your local `.env`), add:

- `STRIPE_SECRET_KEY` — your Stripe secret key (starts with `sk_...`)
- `STRIPE_SAFETY_PASS_PRICE_ID` — the recurring price id (`price_...`)
- `STRIPE_CHECKOUT_SUCCESS_URL` — where to send parents after payment (example: `https://yourdomain.com/?view=parent&checkout=success`)
- `STRIPE_CHECKOUT_CANCEL_URL` — where to send parents if they cancel (example: `https://yourdomain.com/?view=parent&checkout=cancel`)

Notes:

- Success + cancel URLs can be overridden per environment. If you don’t set them, the API will try to infer the origin and fall back to `/?view=parent&checkout=...`.

### 3) What happens in the app

- Parent clicks **Unlock Safety Pass** in Parent view.
- App calls `POST /api/create-checkout-session` and redirects the browser to Stripe Checkout.
- On success redirect, the app sets `sparki_safety_pass_v1=true` in localStorage.

### 4) Production note (recommended next step)

For real enforcement across devices, add a Stripe webhook + server-side entitlement checks.

