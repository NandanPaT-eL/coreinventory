// backend/src/controllers/delivery.controller.js
import mongoose from "mongoose";
import Delivery from "../models/Delivery.model.js";
import Product from "../models/Product.model.js";
import StockLedger from "../models/StockLedger.model.js";

// @desc    Create new delivery (draft)
// @route   POST /api/v1/deliveries
// @access  Private
export const createDelivery = async (req, res) => {
  try {
    const deliveryData = {
      ...req.body,
      status: "Draft",
      createdBy: req.user.id
    };

    const delivery = await Delivery.create(deliveryData);

    res.status(201).json({
      success: true,
      message: "Delivery created successfully",
      data: delivery
    });
  } catch (error) {
    console.error("Create delivery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create delivery",
      error: error.message
    });
  }
};

// @desc    Get all deliveries with filters
// @route   GET /api/v1/deliveries
// @access  Private
export const getDeliveries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      warehouseId,
      customer,
      startDate,
      endDate
    } = req.query;

    // Build filter
    const filter = {};
    
    if (status) filter.status = status;
    if (warehouseId) filter.warehouseId = warehouseId;
    if (customer) filter["customer.name"] = new RegExp(customer, "i");
    
    if (startDate || endDate) {
      filter.deliveryDate = {};
      if (startDate) filter.deliveryDate.$gte = new Date(startDate);
      if (endDate) filter.deliveryDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const deliveries = await Delivery.find(filter)
      .populate("warehouseId", "name code")
      .populate("createdBy", "name email")
      .populate("validatedBy", "name email")
      .populate("items.productId", "name sku")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Delivery.countDocuments(filter);

    res.json({
      success: true,
      data: deliveries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get deliveries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch deliveries",
      error: error.message
    });
  }
};

// @desc    Get single delivery by ID
// @route   GET /api/v1/deliveries/:id
// @access  Private
export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("warehouseId", "name code location")
      .populate("createdBy", "name email")
      .populate("validatedBy", "name email")
      .populate("canceledBy", "name email")
      .populate("items.productId", "name sku category unitOfMeasure");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error("Get delivery by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery",
      error: error.message
    });
  }
};

// @desc    Update draft delivery
// @route   PUT /api/v1/deliveries/:id
// @access  Private
export const updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    // Only allow updates on draft deliveries
    if (delivery.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft deliveries can be updated"
      });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("warehouseId", "name code")
     .populate("items.productId", "name sku");

    res.json({
      success: true,
      message: "Delivery updated successfully",
      data: updatedDelivery
    });
  } catch (error) {
    console.error("Update delivery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update delivery",
      error: error.message
    });
  }
};

// @desc    Validate delivery (remove from stock)
// @route   POST /api/v1/deliveries/:id/validate
// @access  Private
export const validateDelivery = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("items.productId");

    if (!delivery) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    if (delivery.status === "Done") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Delivery is already validated"
      });
    }

    if (delivery.status === "Canceled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Cannot validate canceled delivery"
      });
    }

    // Update delivered quantities (either from request or use ordered)
    const items = req.body.items || delivery.items.map(item => ({
      productId: item.productId._id,
      deliveredQuantity: item.orderedQuantity,
      batchNumber: item.batchNumber,
      location: item.location
    }));

    // Process each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      // Check if sufficient stock exists
      const warehouseStock = product.warehouseStock.find(
        ws => ws.warehouseId.toString() === delivery.warehouseId.toString()
      );

      const availableStock = warehouseStock ? warehouseStock.quantity : 0;
      if (availableStock < item.deliveredQuantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${availableStock}, Requested: ${item.deliveredQuantity}`
        });
      }

      const previousStock = product.currentStock;
      const delta = -item.deliveredQuantity; // Negative for deliveries

      // Create ledger entry
      await StockLedger.createEntry({
        productId: product._id,
        warehouseId: delivery.warehouseId,
        delta,
        previousStock,
        type: "delivery",
        referenceId: delivery._id,
        referenceModel: "Delivery",
        referenceNumber: delivery.deliveryNumber,
        performedBy: req.user.id,
        note: `Delivery to ${delivery.customer.name}`,
        batchNumber: item.batchNumber,
        unitPrice: item.unitPrice
      });

      // Update product warehouse stock
      if (warehouseStock) {
        warehouseStock.quantity -= item.deliveredQuantity;
      }

      product.currentStock += delta; // delta is negative, so this subtracts
      await product.save({ session });
    }

    // Update delivery status
    delivery.status = "Done";
    delivery.validatedBy = req.user.id;
    delivery.validatedAt = new Date();
    
    // Update item delivered quantities
    items.forEach(item => {
      const deliveryItem = delivery.items.find(
        i => i.productId._id.toString() === item.productId.toString()
      );
      if (deliveryItem) {
        deliveryItem.deliveredQuantity = item.deliveredQuantity;
        if (item.batchNumber) deliveryItem.batchNumber = item.batchNumber;
        if (item.location) deliveryItem.location = item.location;
        if (item.unitPrice) deliveryItem.unitPrice = item.unitPrice;
      }
    });

    await delivery.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Delivery validated successfully",
      data: delivery
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Validate delivery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate delivery",
      error: error.message
    });
  }
};

// @desc    Cancel draft delivery
// @route   DELETE /api/v1/deliveries/:id
// @access  Private
export const cancelDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    if (delivery.status === "Done") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel validated delivery"
      });
    }

    if (delivery.status === "Canceled") {
      return res.status(400).json({
        success: false,
        message: "Delivery is already canceled"
      });
    }

    delivery.status = "Canceled";
    delivery.canceledBy = req.user.id;
    delivery.canceledAt = new Date();
    delivery.cancelReason = req.body.reason || "Canceled by user";

    await delivery.save();

    res.json({
      success: true,
      message: "Delivery canceled successfully",
      data: delivery
    });
  } catch (error) {
    console.error("Cancel delivery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel delivery",
      error: error.message
    });
  }
};