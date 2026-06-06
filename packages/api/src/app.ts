import { Hono } from "hono";
import { cors } from "hono/cors";
import { assertEvmAddress } from "@kitetreasury-ai/core";
import { activity, approvals, createItem, items, modules } from "./data.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: [process.env.WEB_ORIGIN ?? "http://localhost:5173"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true, service: "kitetreasury-ai" }));
app.get("/modules", (c) => c.json({ modules }));
app.get("/treasury", (c) => c.json({ treasury: items, items }));

app.post("/treasury", async (c) => {
  const body = (await c.req.json().catch(() => null)) as { name?: string; description?: string; owner?: string } | null;
  if (!body?.name || !body.description || !body.owner) return c.json({ error: "name, description, and owner are required" }, 400);
  try {
    return c.json({ item: createItem({ name: body.name, description: body.description, owner: assertEvmAddress(body.owner) }) }, 201);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Invalid item" }, 400);
  }
});

app.get("/treasury/:id", (c) => {
  const item = items.find((entry) => entry.id === c.req.param("id"));
  if (!item) return c.json({ error: "Item not found" }, 404);
  return c.json({ item });
});

app.get("/runs", (c) => c.json({ runs: activity, activity }));
app.get("/approvals", (c) => c.json({ approvals }));

app.post("/approvals/:id/approve", (c) => {
  const approval = approvals.find((entry) => entry.id === c.req.param("id"));
  if (!approval) return c.json({ error: "Approval not found" }, 404);
  approval.status = "approved";
  approval.decidedAt = new Date().toISOString();
  return c.json({ approval });
});

app.post("/approvals/:id/deny", (c) => {
  const approval = approvals.find((entry) => entry.id === c.req.param("id"));
  if (!approval) return c.json({ error: "Approval not found" }, 404);
  approval.status = "denied";
  approval.decidedAt = new Date().toISOString();
  return c.json({ approval });
});

app.post("/webhooks/:triggerId", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, string>;
  return c.json({
    accepted: true,
    triggerId: c.req.param("triggerId"),
    preview: true,
    message: "Webhook accepted into preview runtime. Production secrets must be env-only.",
    receivedKeys: Object.keys(body),
  });
});

app.get("/agents", (c) => c.json({ route: "/agents", product: "KiteTreasury AI", preview: true, modules }));
app.get("/approvals", (c) => c.json({ route: "/approvals", product: "KiteTreasury AI", preview: true, modules }));
app.get("/forecast", (c) => c.json({ route: "/forecast", product: "KiteTreasury AI", preview: true, modules }));
app.get("/anomalies", (c) => c.json({ route: "/anomalies", product: "KiteTreasury AI", preview: true, modules }));
app.get("/reconcile", (c) => c.json({ route: "/reconcile", product: "KiteTreasury AI", preview: true, modules }));
app.get("/exports", (c) => c.json({ route: "/exports", product: "KiteTreasury AI", preview: true, modules }));
app.get("/settings", (c) => c.json({ route: "/settings", product: "KiteTreasury AI", preview: true, modules }));
