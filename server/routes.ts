import type { Express, Request, Response } from "express";
import express from "express";
import { type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import { Pool } from "pg";
import pgSession from "connect-pg-simple";
import multer from "multer";
import path from "path";
import fs from "fs";

// Determine which session store to use
let SessionStore: any;
if (process.env.DATABASE_URL) {
  const PgSession = pgSession(session);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  SessionStore = { store: new PgSession({ pool }), pool };
} else {
  const MemSessionStore = MemoryStore(session);
  SessionStore = { store: new MemSessionStore({ checkPeriod: 86400000 }), pool: null };
}

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      name: "sid",
      store: SessionStore.store,
      secret: process.env.SESSION_SECRET || "restaurant-menu-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  });
  app.use("/uploads", express.static(uploadDir));

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      // Save session to database/store before sending response
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      res.json({
        userId: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      console.log("Auth check - session:", req.session);
      console.log("Auth check - userId:", req.session.userId);
      console.log("Auth check - id:", req.session.id);
      console.log("Auth check - user.id:", req.session.user.id);
      
      if (!req.session.id) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.id);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        userId: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("sid"); // ✅ correct cookie
      res.json({ message: "Logged out successfully" });
    });
  });

  app.post("/api/upload", upload.single("file"), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  });

  app.post("/api/waiter-request", async (req: Request, res: Response) => {
    try {
      const { tableId, branchId } = req.body;
      const request = await storage.createWaiterRequest({ tableId, branchId });
      res.json(request);
    } catch (error) {
      console.error("Waiter request error:", error);
      res.status(500).json({ message: "Failed to create waiter request" });
    }
  });

  app.get("/api/dashboard/metrics", async (_req: Request, res: Response) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Metrics error:", error);
      res.status(500).json({ message: "Failed to get metrics" });
    }
  });

  return httpServer;
}
