import { createServer, type Server } from "http";
import { type Express, Request, Response } from "express";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Users routes
  app.get("/api/users", async (_req: Request, res: Response) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const { username, password, name, email, role, phone, branchId } = req.body;
      const user = await storage.createUser({
        username,
        password,
        name: name || "",
        email: email || "",
        role: role || "chef",
        phone: phone || null,
        branchId: branchId || null
      });
      res.json(user);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteUser?.(req.params.id);
      res.json({ message: success ? "User deleted" : "User not found" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Categories routes
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
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      res.json({ message: success ? "Category deleted" : "Category not found" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Items routes
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
      const item = await storage.createItem(req.body);
      res.json(item);
    } catch (error) {
      console.error("Create item error:", error);
      res.status(500).json({ message: "Failed to create item" });
    }
  });

  app.patch("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const item = await storage.updateItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Update item error:", error);
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteItem(req.params.id);
      res.json({ message: success ? "Item deleted" : "Item not found" });
    } catch (error) {
      console.error("Delete item error:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (_req: Request, res: Response) => {
    try {
      const allOrders = await storage.getAllOrders();
      res.json(allOrders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Failed to get orders" });
    }
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const order = await storage.createOrder(req.body);
      res.json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Failed to get order" });
    }
  });

  app.patch("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Update order error:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Food Types routes
  app.get("/api/food-types", async (_req: Request, res: Response) => {
    try {
      const allFoodTypes = await storage.getAllFoodTypes();
      res.json(allFoodTypes);
    } catch (error) {
      console.error("Get food types error:", error);
      res.status(500).json({ message: "Failed to get food types" });
    }
  });

  app.post("/api/food-types", async (req: Request, res: Response) => {
    try {
      const foodType = await storage.createFoodType(req.body);
      res.json(foodType);
    } catch (error) {
      console.error("Create food type error:", error);
      res.status(500).json({ message: "Failed to create food type" });
    }
  });

  app.patch("/api/food-types/:id", async (req: Request, res: Response) => {
    try {
      const foodType = await storage.updateFoodType(req.params.id, req.body);
      if (!foodType) {
        return res.status(404).json({ message: "Food type not found" });
      }
      res.json(foodType);
    } catch (error) {
      console.error("Update food type error:", error);
      res.status(500).json({ message: "Failed to update food type" });
    }
  });

  app.delete("/api/food-types/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteFoodType(req.params.id);
      res.json({ message: success ? "Food type deleted" : "Food type not found" });
    } catch (error) {
      console.error("Delete food type error:", error);
      res.status(500).json({ message: "Failed to delete food type" });
    }
  });

  // Materials routes
  app.get("/api/materials", async (_req: Request, res: Response) => {
    try {
      const allMaterials = await storage.getAllMaterials();
      res.json(allMaterials);
    } catch (error) {
      console.error("Get materials error:", error);
      res.status(500).json({ message: "Failed to get materials" });
    }
  });

  app.post("/api/materials", async (req: Request, res: Response) => {
    try {
      const material = await storage.createMaterial(req.body);
      res.json(material);
    } catch (error) {
      console.error("Create material error:", error);
      res.status(500).json({ message: "Failed to create material" });
    }
  });

  app.patch("/api/materials/:id", async (req: Request, res: Response) => {
    try {
      const material = await storage.updateMaterial(req.params.id, req.body);
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }
      res.json(material);
    } catch (error) {
      console.error("Update material error:", error);
      res.status(500).json({ message: "Failed to update material" });
    }
  });

  app.delete("/api/materials/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteMaterial(req.params.id);
      res.json({ message: success ? "Material deleted" : "Material not found" });
    } catch (error) {
      console.error("Delete material error:", error);
      res.status(500).json({ message: "Failed to delete material" });
    }
  });

  // Languages routes
  app.get("/api/languages", async (_req: Request, res: Response) => {
    try {
      const allLanguages = await storage.getAllLanguages();
      res.json(allLanguages);
    } catch (error) {
      console.error("Get languages error:", error);
      res.status(500).json({ message: "Failed to get languages" });
    }
  });

  app.post("/api/languages", async (req: Request, res: Response) => {
    try {
      const language = await storage.createLanguage(req.body);
      res.json(language);
    } catch (error) {
      console.error("Create language error:", error);
      res.status(500).json({ message: "Failed to create language" });
    }
  });

  app.patch("/api/languages/:id", async (req: Request, res: Response) => {
    try {
      const language = await storage.updateLanguage(req.params.id, req.body);
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
      res.json(language);
    } catch (error) {
      console.error("Update language error:", error);
      res.status(500).json({ message: "Failed to update language" });
    }
  });

  app.delete("/api/languages/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteLanguage(req.params.id);
      res.json({ message: success ? "Language deleted" : "Language not found" });
    } catch (error) {
      console.error("Delete language error:", error);
      res.status(500).json({ message: "Failed to delete language" });
    }
  });

  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (_req: Request, res: Response) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Get dashboard metrics error:", error);
      res.status(500).json({ message: "Failed to get metrics" });
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
      const branch = await storage.createBranch(req.body);
      res.json(branch);
    } catch (error) {
      console.error("Create branch error:", error);
      res.status(500).json({ message: "Failed to create branch" });
    }
  });

  app.patch("/api/branches/:id", async (req: Request, res: Response) => {
    try {
      const branch = await storage.updateBranch(req.params.id, req.body);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.json(branch);
    } catch (error) {
      console.error("Update branch error:", error);
      res.status(500).json({ message: "Failed to update branch" });
    }
  });

  app.delete("/api/branches/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteBranch(req.params.id);
      res.json({ message: success ? "Branch deleted" : "Branch not found" });
    } catch (error) {
      console.error("Delete branch error:", error);
      res.status(500).json({ message: "Failed to delete branch" });
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
      const table = await storage.createTable(req.body);
      res.json(table);
    } catch (error) {
      console.error("Create table error:", error);
      res.status(500).json({ message: "Failed to create table" });
    }
  });

  app.patch("/api/tables/:id", async (req: Request, res: Response) => {
    try {
      const table = await storage.updateTable(req.params.id, req.body);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
      res.json(table);
    } catch (error) {
      console.error("Update table error:", error);
      res.status(500).json({ message: "Failed to update table" });
    }
  });

  app.delete("/api/tables/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteTable(req.params.id);
      res.json({ message: success ? "Table deleted" : "Table not found" });
    } catch (error) {
      console.error("Delete table error:", error);
      res.status(500).json({ message: "Failed to delete table" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
