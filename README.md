# Division One Crypto Frontend (D1C)

Support your favorite Division 1 college program with every $D1C trade. This is the Next.js frontend for Division One Crypto featuring Solana wallet connect, Sign-In With Solana (SIWS), email OTP MFA, college leaderboards, user stats, and mobile-friendly wallet flows.

## Tech Stack

- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS 4
- Solana: `@solana/web3.js`, Wallet Adapter (Phantom)

## Features

- Connect Phantom wallet (desktop and mobile-friendly)
- SIWS authentication with secure httpOnly cookie
- Email OTP MFA; access token cookie set on verify
- College and user leaderboards and stats
- College linking to user profile
- Helius RPC integration to fetch on-chain $D1C balances

## Requirements

- Node.js 18+ and npm
- Backend API running locally on `http://localhost:3000` (used by frontend API routes)
- Helius API key for Solana RPC

## Environment Variables

Create a `.env.local` with:

```
HELIUS_API_KEY=your_helius_api_key
```

Notes:
- The token balance route reads `process.env.HELIUS_API_KEY` on the server.
- In AWS Amplify, `HELIUS_API_KEY` must be set in the environment; the build writes it to `.env.production`.

## Getting Started (Development)

1) Install dependencies

```bash
npm ci
```

2) Start the frontend on port 3001 (expected by the app's internal API client)

```bash
PORT=3001 npm run dev
```

3) In another terminal, ensure the backend is running on `http://localhost:3000`.

4) Open `http://localhost:3001` in your browser.

## Scripts

```bash
npm run dev      # Start dev server (set PORT=3001 for local dev)
npm run build    # Build for production
npm run start    # Start production build
npm run lint     # Lint
```

## Solana Network

- Development: Devnet (via `clusterApiUrl(Devnet)`)
- Production: Mainnet

## Authentication Flow

1) Connect wallet with Phantom (desktop or mobile)
2) SIWS: sign a message; app sets `siws-auth` httpOnly cookie
3) MFA: request OTP via `/api/auth/email`, then verify via `/api/auth/verify`
4) On verify, app sets `mfa-auth`, `accessToken`, and `isAdmin` cookies

Client-side state also stores `siws-auth` and MFA flags in `localStorage` to drive UI.

## Key Internal API Routes (frontend `/api`)

- `GET /api/helius/token-balance?userAddress=...` — fetch $D1C balance using Helius RPC
- `GET /api/user-data?userAddress=...` — user profile by wallet
- `GET /api/user-contributions?userAddress=...` — user stats
- `GET /api/trading-volume` — platform trading volume
- `POST /api/auth/siws` — set SIWS cookie
- `POST /api/auth/logout` — clear auth cookies
- `POST /api/auth/email` — request OTP (proxies backend)
- `POST /api/auth/verify` — verify OTP (proxies backend, sets cookies)

Additional routes include colleges, leaderboards, admins, D1C wallets, and fee management under `src/app/api/...`.

## Project Structure (partial)

```
src/
  app/
    api/                # Frontend API routes (proxy + server logic)
    auth/               # MFA pages
    dashboard/          # Authenticated dashboard
    page.tsx            # Landing page
  components/           # UI components (WalletConnectButton, Leaderboards, etc.)
  hooks/                # useSIWS authentication hook
  lib/                  # constants, API helper, Solana utils
  providers/            # SolanaProvider
```

## Deployment

This app is configured for AWS Amplify. Ensure `HELIUS_API_KEY` is set as an environment variable. See `amplify.yml` for the build pipeline (env injection and Next.js build).

## Notes

- Frontend base URL in development is `http://localhost:3001` (see `src/lib/constants.ts`). Start the dev server on port 3001 to match.
- Backend base URL in development is `http://localhost:3000`. Update `src/lib/constants.ts` if your backend differs.
