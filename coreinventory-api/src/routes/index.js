// backend/src/routes/index.js
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import warehouseRoutes from "./warehouse.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/warehouses", warehouseRoutes);

export default router;