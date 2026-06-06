import { buildActivity, demoAddress, type ActivityEvent, type ApprovalRequest, type ProductItem, type ProductModule } from "@kitetreasury-ai/core";

export const modules: ProductModule[] = [
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
];

export const items: ProductItem[] = [
  {
    "id": "treasury_account_1",
    "name": "Treasury Dashboard",
    "description": "Unified balance, spend, agent, and transaction overview.",
    "owner": demoAddress,
    "status": "active",
    "risk": "medium",
    "moduleId": "module_1",
    "budgetKite": "5",
    "createdAt": "2026-06-06T02:00:00.000Z"
  },
  {
    "id": "treasury_account_2",
    "name": "Spend Approval Agent",
    "description": "AI-assisted review for spend requests with policy reasons.",
    "owner": demoAddress,
    "status": "active",
    "risk": "high",
    "moduleId": "module_2",
    "budgetKite": "50",
    "createdAt": "2026-06-06T02:00:00.000Z"
  },
  {
    "id": "treasury_account_3",
    "name": "Budget Forecasting",
    "description": "Forecast future spend from usage trends and planned budgets.",
    "owner": demoAddress,
    "status": "draft",
    "risk": "low",
    "moduleId": "module_3",
    "budgetKite": "0",
    "createdAt": "2026-06-06T02:00:00.000Z"
  }
];

export const activity: ActivityEvent[] = [
  buildActivity(items[0], "KiteTreasury AI preview event accepted", new Date("2026-06-06T02:10:00.000Z")),
  buildActivity(items[1], "Risky Kite action queued for explicit approval", new Date("2026-06-06T02:20:00.000Z")),
];

export const approvals: ApprovalRequest[] = [
  {
    id: "approval_1",
    itemId: items[1].id,
    status: "pending",
    reason: "High-risk or fund-moving Kite action requires explicit approval.",
    risk: "high",
    requestedAt: "2026-06-06T02:20:00.000Z",
  },
];

export function createItem(input: Pick<ProductItem, "name" | "description" | "owner">) {
  const item: ProductItem = {
    id: `treasury_account_${Date.now()}`,
    name: input.name,
    description: input.description,
    owner: input.owner,
    status: "draft",
    risk: "low",
    moduleId: modules[0].id,
    budgetKite: "0",
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  return item;
}
