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
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
        language: user.language || "en",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
        language: user.language || "en",
      });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/auth/me", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { name, avatar, phone } = req.body;
      const user = await storage.updateUser(req.session.userId, { name, avatar, phone });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
        language: user.language || "en",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.patch("/api/auth/update-language", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { language } = req.body;
      if (!language || !['en', 'fa', 'tr', 'ar'].includes(language)) {
        return res.status(400).json({ message: "Invalid language" });
      }

      const user = await storage.updateUser(req.session.userId, { language });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
        language: user.language || "en",
      });
    } catch (error) {
      console.error("Language update error:", error);
      res.status(500).json({ message: "Failed to update language" });
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

  app.get("/api/users", async (_req: Request, res: Response) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        branchId: u.branchId,
        isActive: true,
      })));
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const { name, email, role, branchId } = req.body;
      const user = await storage.updateUser(req.params.id, { 
        name, 
        email, 
        role,
        branchId: branchId === 'all' ? undefined : branchId,
      });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        isActive: true,
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.get("/api/branches", async (_req: Request, res: Response) => {
    try {
      const allBranches = await storage.getAllBranches();
      res.json(allBranches);
    } catch (error) {
      console.error("Get branches error:", error);
      res.status(500).json({ message: "Failed to get branches" });
    }
  });

  app.post("/api/branches", async (req: Request, res: Response) => {
    try {
      const { name, address, phone, isActive } = req.body;
      const branch = await storage.createBranch({ name, address, phone, isActive });
      res.json(branch);
    } catch (error) {
      console.error("Create branch error:", error);
      res.status(500).json({ message: "Failed to create branch" });
    }
  });

  app.patch("/api/branches/:id", async (req: Request, res: Response) => {
    try {
      const { name, address, phone, isActive } = req.body;
      const branch = await storage.updateBranch(req.params.id, { name, address, phone, isActive });
      if (!branch) return res.status(404).json({ message: "Branch not found" });
      res.json(branch);
    } catch (error) {
      console.error("Update branch error:", error);
      res.status(500).json({ message: "Failed to update branch" });
    }
  });

  app.delete("/api/branches/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteBranch(req.params.id);
      if (!success) return res.status(404).json({ message: "Branch not found" });
      res.json({ message: "Branch deleted" });
    } catch (error) {
      console.error("Delete branch error:", error);
      res.status(500).json({ message: "Failed to delete branch" });
    }
  });

  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const allCategories = await storage.getAllCategories();
      res.json(allCategories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Failed to get categories" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const { generalName, name, image, order, isActive } = req.body;
      const category = await storage.createCategory({ 
        generalName: generalName || "",
        name: name || {},
        image: image || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 1,
      });
      res.json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const { generalName, name, image, order, isActive } = req.body;
      const updateData: any = {};
      
      if (generalName !== undefined) updateData.generalName = generalName;
      if (name !== undefined) updateData.name = name;
      if (image !== undefined) updateData.image = image;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (order !== undefined) updateData.order = order;
      
      const category = await storage.updateCategory(req.params.id, updateData);
      if (!category) return res.status(404).json({ message: "Category not found" });
      res.json(category);
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) return res.status(404).json({ message: "Category not found" });
      res.json({ message: "Category deleted" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  app.get("/api/items", async (_req: Request, res: Response) => {
    try {
      const allItems = await storage.getAllItems();
      res.json(allItems);
    } catch (error) {
      console.error("Get items error:", error);
      res.status(500).json({ message: "Failed to get items" });
    }
  });

  app.post("/api/items", async (req: Request, res: Response) => {
    try {
      const { categoryId, name, shortDescription, longDescription, price, discountedPrice, maxSelect, image, available, suggested, isNew, materials } = req.body;
      const item = await storage.createItem({
        categoryId,
        name: name || {},
        shortDescription: shortDescription || {},
        longDescription: longDescription || {},
        price: price ? price.toString() : "0",
        discountedPrice: discountedPrice ? discountedPrice.toString() : null,
        maxSelect: maxSelect ? maxSelect.toString() : null,
        image: image || null,
        available: available !== undefined ? available : true,
        suggested: suggested !== undefined ? suggested : false,
        isNew: isNew !== undefined ? isNew : false,
        materials: materials || [],
        types: [],
      });
      res.json(item);
    } catch (error) {
      console.error("Create item error:", error);
      res.status(500).json({ message: "Failed to create item" });
    }
  });

  app.patch("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const { categoryId, name, shortDescription, longDescription, price, discountedPrice, maxSelect, image, available, suggested, isNew, materials } = req.body;
      
      const updateData: any = {};
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (name !== undefined) updateData.name = name;
      if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
      if (longDescription !== undefined) updateData.longDescription = longDescription;
      if (price !== undefined) updateData.price = price.toString();
      if (discountedPrice !== undefined) updateData.discountedPrice = discountedPrice ? discountedPrice.toString() : null;
      if (maxSelect !== undefined) updateData.maxSelect = maxSelect ? maxSelect.toString() : null;
      if (image !== undefined) updateData.image = image;
      if (available !== undefined) updateData.available = available;
      if (suggested !== undefined) updateData.suggested = suggested;
      if (isNew !== undefined) updateData.isNew = isNew;
      if (materials !== undefined) updateData.materials = materials;

      const item = await storage.updateItem(req.params.id, updateData);
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error) {
      console.error("Update item error:", error);
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteItem(req.params.id);
      if (!success) return res.status(404).json({ message: "Item not found" });
      res.json({ message: "Item deleted" });
    } catch (error) {
      console.error("Delete item error:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  app.get("/api/tables", async (_req: Request, res: Response) => {
    try {
      const allTables = await storage.getAllTables();
      res.json(allTables);
    } catch (error) {
      console.error("Get tables error:", error);
      res.status(500).json({ message: "Failed to get tables" });
    }
  });

  app.post("/api/tables", async (req: Request, res: Response) => {
    try {
      const { branchId, tableNumber, capacity, location, isActive } = req.body;
      const table = await storage.createTable({
        tableNumber: tableNumber || '',
        branchId,
        capacity: capacity || 4,
        location: location || '',
        status: 'available',
        isActive: isActive !== undefined ? isActive : true,
      });
      res.json(table);
    } catch (error) {
      console.error("Create table error:", error);
      res.status(500).json({ message: "Failed to create table" });
    }
  });

  app.patch("/api/tables/:id", async (req: Request, res: Response) => {
    try {
      const { branchId, tableNumber, capacity, location, isActive } = req.body;
      const table = await storage.updateTable(req.params.id, {
        tableNumber: tableNumber || undefined,
        branchId: branchId || undefined,
        capacity: capacity !== undefined ? capacity : undefined,
        location: location || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      });
      if (!table) return res.status(404).json({ message: "Table not found" });
      res.json(table);
    } catch (error) {
      console.error("Update table error:", error);
      res.status(500).json({ message: "Failed to update table" });
    }
  });

  app.delete("/api/tables/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteTable(req.params.id);
      if (!success) return res.status(404).json({ message: "Table not found" });
      res.json({ message: "Table deleted" });
    } catch (error) {
      console.error("Delete table error:", error);
      res.status(500).json({ message: "Failed to delete table" });
    }
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

  app.get("/api/languages", async (_req: Request, res: Response) => {
    try {
      const languages = await storage.getAllLanguages?.();
      res.json(languages || []);
    } catch (error) {
      console.error("Get languages error:", error);
      res.status(500).json({ message: "Failed to get languages" });
    }
  });

  app.post("/api/languages", async (req: Request, res: Response) => {
    try {
      const { code, name, nativeName, direction, flagImage, isActive, isDefault } = req.body;
      const language = await storage.createLanguage?.({ code, name, nativeName, direction, flagImage, isActive, isDefault: isDefault || false, order: 1 });
      res.json(language);
    } catch (error) {
      console.error("Create language error:", error);
      res.status(500).json({ message: "Failed to create language" });
    }
  });

  app.patch("/api/languages/:id", async (req: Request, res: Response) => {
    try {
      const { code, name, nativeName, direction, flagImage, isActive, isDefault } = req.body;
      const language = await storage.updateLanguage?.(req.params.id, { code, name, nativeName, direction, flagImage, isActive, isDefault });
      res.json(language);
    } catch (error) {
      console.error("Update language error:", error);
      res.status(500).json({ message: "Failed to update language" });
    }
  });

  app.delete("/api/languages/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteLanguage?.(req.params.id);
      res.json({ message: success ? "Language deleted" : "Language not found" });
    } catch (error) {
      console.error("Delete language error:", error);
      res.status(500).json({ message: "Failed to delete language" });
    }
  });

  app.get("/api/materials", async (_req: Request, res: Response) => {
    try {
      const materials = await storage.getAllMaterials?.();
      res.json(materials || []);
    } catch (error) {
      console.error("Get materials error:", error);
      res.status(500).json({ message: "Failed to get materials" });
    }
  });

  app.post("/api/materials", async (req: Request, res: Response) => {
    try {
      const { name, icon, color } = req.body;
      const material = await storage.createMaterial?.({ 
        name: name || {}, 
        icon: icon || null, 
        color: color || null,
        isActive: true,
        order: 1 
      });
      res.json(material);
    } catch (error) {
      console.error("Create material error:", error);
      res.status(500).json({ message: "Failed to create material" });
    }
  });

  app.patch("/api/materials/:id", async (req: Request, res: Response) => {
    try {
      const { name, icon, color } = req.body;
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (icon !== undefined) updateData.icon = icon;
      if (color !== undefined) updateData.color = color;
      
      const material = await storage.updateMaterial?.(req.params.id, updateData);
      res.json(material);
    } catch (error) {
      console.error("Update material error:", error);
      res.status(500).json({ message: "Failed to update material" });
    }
  });

  app.delete("/api/materials/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteMaterial?.(req.params.id);
      res.json({ message: success ? "Material deleted" : "Material not found" });
    } catch (error) {
      console.error("Delete material error:", error);
      res.status(500).json({ message: "Failed to delete material" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.json([]);
      }

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const result = await pool.query(
        "SELECT id, order_number, table_number, branch_id, items, status, total_amount, notes, created_at, updated_at FROM orders ORDER BY created_at DESC"
      );

      await pool.end();
      res.json(result.rows);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Failed to get orders" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.status(404).json({ message: "Order not found" });
      }

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const result = await pool.query(
        "SELECT id, order_number, table_number, branch_id, items, status, total_amount, notes, created_at, updated_at FROM orders WHERE id = $1",
        [req.params.id]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Failed to get order" });
    }
  });

  app.patch("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.status(400).json({ message: "Database not configured" });
      }

      const { status, notes } = req.body;
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const result = await pool.query(
        "UPDATE orders SET status = $1, notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
        [status || "pending", notes || "", req.params.id]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Update order error:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Food Types routes
  app.get("/api/food-types", async (_req: Request, res: Response) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.json([]);
      }

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const result = await pool.query(
        "SELECT id, name, description, icon, color, is_active, \"order\" FROM food_types ORDER BY \"order\" ASC"
      );

      await pool.end();
      res.json(result.rows);
    } catch (error) {
      console.error("Get food types error:", error);
      res.status(500).json({ message: "Failed to get food types" });
    }
  });

  app.post("/api/food-types", async (req: Request, res: Response) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.status(400).json({ message: "Database not configured" });
      }

      const { name, description, icon, color } = req.body;
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const result = await pool.query(
        "INSERT INTO food_types (name, description, icon, color, is_active, \"order\") VALUES ($1, $2, $3, $4, true, 1) RETURNING *",
        [
          JSON.stringify(name),
          JSON.stringify(description || {}),
          icon || "leaf",
          color || "#4CAF50",
        ]
      );

      await pool.end();
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Create food type error:", error);
      res.status(500).json({ message: "Failed to create food type" });
    }
  });

  app.patch("/api/food-types/:id", async (req: Request, res: Response) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.status(400).json({ message: "Database not configured" });
      }

      const { name, description, icon, color } = req.body;
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const result = await pool.query(
        "UPDATE food_types SET name = $1, description = $2, icon = $3, color = $4 WHERE id = $5 RETURNING *",
        [
          JSON.stringify(name),
          JSON.stringify(description || {}),
          icon || "leaf",
          color || "#4CAF50",
          req.params.id,
        ]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Food type not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Update food type error:", error);
      res.status(500).json({ message: "Failed to update food type" });
    }
  });

  app.delete("/api/food-types/:id", async (req: Request, res: Response) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.status(400).json({ message: "Database not configured" });
      }

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const result = await pool.query(
        "DELETE FROM food_types WHERE id = $1 RETURNING id",
        [req.params.id]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Food type not found" });
      }

      res.json({ message: "Food type deleted" });
    } catch (error) {
      console.error("Delete food type error:", error);
      res.status(500).json({ message: "Failed to delete food type" });
    }
  });

  return httpServer;
}
