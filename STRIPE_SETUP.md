## Stripe setup (Adventure Academy subscription)

This project uses **Stripe Checkout (hosted page)** + the **Stripe Node SDK**.

### 1) Create a Product + recurring Price in Stripe

- Create a **Product** for **Adventure Academy** (tutor + Homework Adventure + full practice tracks + subscriber PDF access).
- Add a **recurring Price** (monthly or yearly).
- Copy the **Price ID** (looks like `price_...`).

### 2) Add environment variables

In Vercel (and in your local `.env`), add:

- `STRIPE_SECRET_KEY` — your Stripe secret key (starts with `sk_...`)
- `STRIPE_ACADEMY_PRICE_ID` — the recurring price id (`price_...`) or product id (`prod_...`)
- `STRIPE_CHECKOUT_SUCCESS_URL` — where to send parents after payment (example: `https://yourdomain.com/?view=parent&checkout=success`)
- `STRIPE_CHECKOUT_CANCEL_URL` — where to send parents if they cancel (example: `https://yourdomain.com/?view=parent&checkout=cancel`)

Optional: per-ebook one-time prices `STRIPE_EBOOK_1_PRICE_ID` … `STRIPE_EBOOK_6_PRICE_ID` for `POST /api/create-ebook-checkout-session`.

Notes:

- Success + cancel URLs can be overridden per environment. If you don’t set them, the API will try to infer the origin and fall back to `/?view=parent&checkout=...`.

### 3) What happens in the app

- Parent starts **Adventure Academy** checkout from Parent view (Billing tab), ebook reader, or other flows that call `POST /api/create-checkout-session`.
- On success redirect, the app stores the checkout session id for **`entitlement_type=academy`** in localStorage (`sparki_academy_checkout_session_v1`) and sets `sparki_academy_subscription_v1=true`.

### 4) Production note (recommended next step)

For real enforcement across devices, add a Stripe webhook + server-side subscription truth. Today, APIs verify the checkout session’s subscription is active/trialing against `STRIPE_ACADEMY_PRICE_ID`.
