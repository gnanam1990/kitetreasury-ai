# KiteTreasury AI — Project Prompt Pack

## One-line summary
AI CFO for teams and agent wallets on Kite.

## Product positioning
Treasury intelligence for agent teams: budget planning, spend approvals, anomaly detection, forecasts, payment reconciliation, and exports.

## Why this exists
Agent teams need controls and insight: who spent what, why it was approved, how much budget remains, which agents are risky, and what to export for finance.

## Repository name
`kitetreasury-ai`

## Header subtitle
`TREASURY AI`

## Core routes
- `/`
- `/treasury`
- `/agents`
- `/approvals`
- `/forecast`
- `/anomalies`
- `/reconcile`
- `/exports`
- `/settings`


## Core modules
1. **Treasury Dashboard** — Unified balance, spend, agent, and transaction overview.
2. **Spend Approval Agent** — AI-assisted review for spend requests with policy reasons.
3. **Budget Forecasting** — Forecast future spend based on usage trends and planned budgets.
4. **Suspicious Spend Detector** — Detect abnormal transactions and agent spending patterns.
5. **Accounting + Export Center** — Reconcile and export tx data for finance/accounting workflows.

## API surface
- `GET /treasury`
- `POST /treasury`
- `GET /treasury/:id/snapshot`
- `POST /spend-requests`
- `POST /spend-requests/:id/decide`
- `GET /forecasts`
- `GET /anomalies`
- `POST /exports`


## Safety requirements
- AI CFO never signs transactions
- Forecasts are estimates
- Accounting exports are not tax advice
- Suspicious labels are evidence-based and cautious


## Build philosophy
This is not a small demo. Build it as a serious productivity platform for Kite AI agents. Every UI screen must move the user toward a real workflow, decision, payment, approval, or operational outcome.
