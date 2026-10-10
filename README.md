# 🐝 amk – Frontend

Welcome to **amk**, an invite-only SaaS eCommerce platform where entrepreneurs can launch, manage, and grow their online stores with powerful tools including AI features, affiliate systems, tiered memberships, and custom marketing.

---

## 🛠️ Development

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, MUI and Tailwind CSS v4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
npm run lint      # ESLint (next/core-web-vitals + typescript)
npm run typecheck # tsc --noEmit
npm run invoice:thumbnails  # re-render gallery thumbnails after editing an invoice template
```

### Invoice builder

The invoice builder (`/invoice/templates`, `/invoice/editor/[templateId]`) runs entirely in the browser — no backend:

- PDFs are generated client-side with `@react-pdf/renderer` (vector text, embedded fonts in `public/fonts/invoice`).
- The preview rasterises that same PDF with `pdf.js`, so what you see is exactly what downloads.
- Drafts are kept in `localStorage`; templates live in `src/lib/invoice/pdf/InvoiceDocument.tsx` and are registered in `src/lib/invoice/templates.ts`.

Set `NEXT_PUBLIC_API_BASE_URL` (the old `VITE_API_BASE_URL` is still accepted) in `.env`.

### Sign-in (email/password and Google)

Email/password registration and login, and "Continue with Google", are handled by this app's own route handlers (`src/app/api/auth/*`), not the external API. Users are stored in the MongoDB `users` collection (unique by email; passwords hashed with scrypt; a verified Google email is linked to an existing password account), and the session is a signed JWT kept in the httpOnly `access_token` cookie.

1. In Google Cloud Console → APIs & Services → Credentials, create an **OAuth client ID** (type: Web application).
2. Add an authorised redirect URI for each origin: `http://localhost:3000/api/auth/google/callback` and `https://<your-domain>/api/auth/google/callback`.
3. Set these in `.env.local` (and in Vercel project settings):

```bash
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
MONGODB_DB=amk                     # optional, defaults to "amk"
AUTH_SECRET=<random 32+ chars>      # e.g. `openssl rand -base64 32`
```

| Route | Purpose |
| --- | --- |
| `POST /api/auth/register` | `{ firstName, lastName, email, password }` → creates the user and signs them in (409 if the email exists) |
| `POST /api/auth/login` | `{ email, password }` → sets the session cookie (401 on bad credentials) |
| `GET /api/auth/google` | Redirects to Google (state + nonce + PKCE) |
| `GET /api/auth/google/callback` | Verifies the ID token, upserts the user, sets the session cookie |
| `GET /api/auth/me` | Returns the signed-in user |
| `GET /api/auth/logout` | Clears the session cookie |

| Path | Purpose |
| --- | --- |
| `src/app/` | Routes (each folder with a `page.tsx` is a URL) |
| `src/components/` | Shared UI components |
| `src/lib/` | API client, auth helpers, invoice logic, shared types, MUI theme |
| `src/styles/globals.css` | Tailwind entry point and theme tokens |
| `src/proxy.ts` | Redirects signed-out users away from `/user/*` |

---

## 🚀 Features at a Glance

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🏪 Store Creation              | Wizard-based flow to name, brand, and configure a store        |
| 💳 Payment Integration         | Stripe, PayPal, Razorpay setup for global/local payments       |
| 📦 Product & Inventory Manager | Add/edit products, track stock, orders, pricing                |
| 📈 Sales Analytics             | Reports on revenue, inventory, ROAS, CPA, conversions          |
| 📢 Marketing Tools             | Ad campaigns, email automation, affiliate referrals            |
| 🔐 Membership Tiers            | Free, 3.5K, 6K, and Premium – each unlocking new capabilities  |
| 👥 Community Support           | Forums, mentorship, webinars for higher tiers                  |
| 🛠️ Admin Dashboard             | User/store management, subscriptions, payments, support system |

---

## 🧭 Platform Overview Diagram

```mermaid
graph TD
  A[User (with Invite Code)] --> B[Store Creation Wizard]
  B --> C[Store Dashboard]
  C --> D[Product & Inventory Management]
  C --> E[Payment Gateway Setup]
  C --> F[Marketing & Ads]
  C --> G[Analytics Reports]
  C --> H[Affiliate Tools]
  H --> I[Affiliate Payouts]
  C --> J[Community Features]
  A --> K[Membership Tier Assigned]
  K --> C
  Admin[Platform Admin Panel] --> E
  Admin --> C
  Admin --> L[User and Store Monitoring]
```
