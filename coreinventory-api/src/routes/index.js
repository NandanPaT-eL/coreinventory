import { Router } from "express";
import authRoutes from "./auth.routes.js";
import warehouseRoutes from "./warehouse.routes.js";
import productRoutes from "./product.routes.js";
import ledgerRoutes from "./ledger.routes.js";
import receiptRoutes from "./receipt.routes.js";
import deliveryRoutes from "./delivery.routes.js";
import transferRoutes from "./transfer.routes.js";
import adjustmentRoutes from "./adjustment.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/products", productRoutes);
router.use("/ledger", ledgerRoutes);
router.use("/receipts", receiptRoutes);
router.use("/deliveries", deliveryRoutes);
router.use("/transfers", transferRoutes);
router.use("/adjustments", adjustmentRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
