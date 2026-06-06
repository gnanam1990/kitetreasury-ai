export const product = {
  name: "KiteTreasury AI",
  repo: "kitetreasury-ai",
  subtitle: "TREASURY AI",
  hero: "Run an AI-assisted treasury workspace for balances, spend approvals, forecasts, anomalies, and exports.",
  positioning: "AI CFO for teams and agent wallets on Kite.",
  entity: "treasury",
  entitySingular: "treasury account",
  entityRoute: "/treasury",
  routes: [
  "/",
  "/treasury",
  "/agents",
  "/approvals",
  "/forecast",
  "/anomalies",
  "/reconcile",
  "/exports",
  "/settings"
],
  modules: [
  {
    "id": "module_1",
    "name": "Treasury Dashboard",
    "description": "Unified balance, spend, agent, and transaction overview.",
    "preview": "live"
  },
  {
    "id": "module_2",
    "name": "Spend Approval Agent",
    "description": "AI-assisted review for spend requests with policy reasons.",
    "preview": "preview"
  },
  {
    "id": "module_3",
    "name": "Budget Forecasting",
    "description": "Forecast future spend from usage trends and planned budgets.",
    "preview": "preview"
  },
  {
    "id": "module_4",
    "name": "Suspicious Spend Detector",
    "description": "Detect abnormal transactions and agent spending patterns.",
    "preview": "preview"
  },
  {
    "id": "module_5",
    "name": "Accounting + Export Center",
    "description": "Reconcile and export tx data for finance workflows.",
    "preview": "preview"
  }
],
};
