import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateWarehouse, validateWarehouseId } from "../validators/warehouse.validator.js";
import {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deactivateWarehouse,
  activateWarehouse
} from "../controllers/warehouse.controller.js";

const router = Router();

/*
--------------------------------------------------
All warehouse routes require authentication
--------------------------------------------------
*/
router.use(protect);

/*
--------------------------------------------------
Public Routes (within authenticated)
--------------------------------------------------
*/
router.get("/", getWarehouses);
router.get("/:id", validate(validateWarehouseId), getWarehouseById);

/*
--------------------------------------------------
Admin-only Routes
--------------------------------------------------
*/
router.post(
  "/",
  authorizeRoles("admin"),
  validate(validateWarehouse),
  createWarehouse
);

router.put(
  "/:id",
  authorizeRoles("admin"),
  validate(validateWarehouseId),
  validate(validateWarehouse),
  updateWarehouse
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate(validateWarehouseId),
  deactivateWarehouse
);

router.patch(
  "/:id/activate",
  authorizeRoles("admin"),
  validate(validateWarehouseId),
  activateWarehouse
);

export default router;
