import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { createPoolFromEnv } from "./db.js";
import { errorMiddleware, createAuthMiddleware } from "./middleware.js";
import { createSessionStore } from "./sessionStore.js";
import { authRoutes } from "./routesAuth.js";
import { accountRoutes } from "./routesAccount.js";

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);
const COOKIE_NAME = process.env.COOKIE_NAME || "sid";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "dev_secret";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const app = express();
  app.use(express.json());

  // DB
  const pool = createPoolFromEnv();
  await pool.query("SELECT 1");

  // Serve frontend (same-origin => cookie works)
  const frontendPath = path.resolve(__dirname, "..", "..", "frontend");
  app.use(express.static(frontendPath));

  // Sessions (in-memory, آموزشی)
  const sessionStore = createSessionStore();

  // Middlewares
  const authMiddleware = createAuthMiddleware({
    sessionStore,
    cookieName: COOKIE_NAME,
    cookieSecret: COOKIE_SECRET
  });

  // Routes
  app.get("/api/health", (req, res) => res.json({ ok: true, message: "ok" }));
  authRoutes(app, pool, { sessionStore, cookieName: COOKIE_NAME, cookieSecret: COOKIE_SECRET });
  accountRoutes(app, pool, authMiddleware);

  app.get("/", (req, res) => res.sendFile(path.join(frontendPath, "index.html")));

  app.use(errorMiddleware);

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

main().catch((e) => {
  console.error("Failed to start server:", e);
  process.exit(1);
});
