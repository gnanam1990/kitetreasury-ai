# KiteTreasury AI

> An AI CFO workspace for teams and agent wallets on Kite — balances, spend approvals, forecasts, anomaly detection, and exports.

[![CI](https://github.com/gnanam1990/kitetreasury-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/gnanam1990/kitetreasury-ai/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

KiteTreasury AI is a treasury control plane for teams and agent wallets operating on the Kite network. It pairs an approval-gated workspace — treasury accounts, an activity/run log, and pending approvals — with a real on-chain read of Kite Mainnet. The goal is a finance-grade tool where every fund-moving or risky action is policy-checked and approval-first, and where client-submitted claims about money are never trusted. Much of the product surface is intentionally preview-safe today (see [Status](#status)).

## Features

- **Treasury workspace** — list, fetch, and create treasury accounts; owner addresses are validated as EVM/Kite addresses server-side before they are accepted.
- **Approval flow** — pending approvals can be approved or denied through the API, with decision timestamps recorded.
- **Activity / run log** — a queryable record of runs and events, including a worker-backed run simulation.
- **Live Kite Mainnet read** — `GET /chain/stats` fetches the current block height over JSON-RPC (via `viem`) and gas/network stats from the KiteScan explorer, with a 30s cache on the explorer call.
- **Graceful degradation** — the frontend renders from bundled preview data whenever the API is unreachable, so the UI never hard-fails.
- **Pure-TypeScript domain core** — address/tx-hash validation, risk weighting, and approval-requirement rules with no runtime dependencies.

## Tech stack

- **Frontend:** Vite, React 19, TypeScript, Tailwind CSS v4, lucide-react
- **API:** Hono (with `@hono/node-server`)
- **Chain access:** viem (custom `defineChain` for Kite Mainnet/Testnet)
- **Tooling:** pnpm workspaces, TypeScript, Vitest, esbuild
- **Deployment:** Vercel (Build Output API via a custom build script)

## Architecture

A pnpm monorepo. Packages depend on each other through `workspace:*` references.

| Package | Purpose |
| --- | --- |
| `packages/core` | Pure-TypeScript domain logic: types, address/tx validation, risk and approval rules. |
| `packages/connectors` | Kite chain constants, a `viem` public client, KiteScan URL/cache helpers. |
| `packages/api` | Hono application — all routes, the live chain read, and in-memory data. |
| `packages/worker` | `PreviewRuntime` job runtime used by the run-simulation endpoint. |
| `packages/web` | Vite + React 19 frontend with same-origin API calls and preview fallbacks. |
| `server/index.ts` | Vercel Serverless Function that mounts the shared Hono `app` under `/api`. |

## Getting started

### Prerequisites

- Node.js 22
- pnpm 9.15.9 (declared via `packageManager`)

### Installation

```bash
pnpm install
```

### Configuration

Copy `.env.example` and adjust as needed. The project reads the following variables (names only — never commit real secrets):

| Variable | Purpose |
| --- | --- |
| `KITE_NETWORK` | Active Kite network (`mainnet` / `testnet`). |
| `KITE_MAINNET_RPC` | Kite Mainnet JSON-RPC endpoint. |
| `KITE_MAINNET_API` | KiteScan Mainnet explorer API base. |
| `KITE_TESTNET_RPC` | Kite Testnet JSON-RPC endpoint. |
| `KITE_TESTNET_API` | KiteScan Testnet explorer API base. |
| `API_PORT` | Port for the local dev API server (default `8787`). |
| `WEB_ORIGIN` | Allowed CORS origin for the API (default `http://localhost:5173`). |
| `VITE_API_URL` | Frontend API base for local dev. Ignored in production builds, where the SPA calls the same-origin `/api`. |
| `WEBHOOK_SECRET_DEMO` | Local secret for the preview webhook intake. |
| `LLM_PROVIDER` | Selected LLM provider mode. Defaults to `preview` (no live model calls). |

### Running

```bash
pnpm dev
```

Frontend: `http://localhost:5173` · API: `http://localhost:8787`

```bash
curl http://localhost:8787/health        # { "ok": true, "service": "kitetreasury-ai" }
curl http://localhost:8787/chain/stats   # live Kite Mainnet block height + gas
```

## Usage

The API is served under `/api` in production (same-origin) and at `http://localhost:8787` in local dev.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Service health probe. |
| GET | `/meta` | Product + module metadata. |
| GET | `/modules` | Product modules. |
| GET | `/treasury` | List treasury accounts. |
| POST | `/treasury` | Create an account (`name`, `description`, `owner` required; `owner` must be a valid EVM address). |
| GET | `/treasury/:id` | Fetch one account. |
| GET | `/runs` | Activity / run log. |
| POST | `/runs/simulate` | Simulate a run through the worker runtime. |
| GET | `/approvals` | Pending approvals. |
| POST | `/approvals/:id/approve` | Approve a pending request. |
| POST | `/approvals/:id/deny` | Deny a pending request. |
| GET | `/chain/stats` | Live Kite Mainnet block height + gas (degrades to a preview payload if infra is down). |
| POST | `/webhooks/:triggerId` | Preview webhook intake. |

## Testing

```bash
pnpm -r typecheck    # type-check every package
pnpm -r test         # run Vitest suites
pnpm --filter @kitetreasury-ai/web build   # production build check
```

Tests cover core validation logic (`packages/core`), API routes including the chain and worker endpoints (`packages/api`), and the worker runtime (`packages/worker`). The web and connectors packages run with `--passWithNoTests`.

## Project structure

```txt
server/index.ts        Hono entry mounted at /api (bundled into a Vercel function)
scripts/               Vercel Build Output API build script
packages/web/          Vite + React 19 frontend
packages/api/          Hono API (app, routes, live chain read, in-memory data)
packages/worker/       PreviewRuntime job runtime + run simulation
packages/core/         pure TypeScript domain logic
packages/connectors/   Kite constants, KiteScan helpers, cached fetch, viem client
docs/                  proof-of-work notes and screenshot
prompts/               staged build prompts this repo was generated from
```

## Status

Preview / MVP. What is real versus preview:

**Real**
- Vite + React 19 + TypeScript frontend with the product routes.
- Hono API runnable locally and deployable to Vercel as a Serverless Function under `/api`.
- Live Kite Mainnet read at `GET /chain/stats` (block height via `viem`, gas via KiteScan).
- Pure-TypeScript core for address/tx validation, risk policy, and approval rules.
- Worker runtime wired into `POST /runs/simulate`.
- Tests for core, API (incl. chain + worker), and worker.

**Preview / not yet real**
- Treasury accounts, approvals, runs, and modules are served from in-memory data — there is no persistent database; created items do not survive a restart.
- Several home-screen metrics (e.g. policy counts, endpoint call volumes) are static placeholder values, not live aggregates.
- Most product modules beyond the Treasury Dashboard are marked `preview`.
- Agentic decisions, payment verification, fund movement, trading, and scoring are preview-safe and not executed by backend code.
- Client-submitted payment claims are not trusted; fund-moving or risky actions are approval-gated by design.
- No official mainnet contract address is claimed or invented in this repo.

## License

[MIT](LICENSE)
</content>
</invoke>
