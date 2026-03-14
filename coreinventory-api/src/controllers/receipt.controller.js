// backend/src/controllers/receipt.controller.js
import Receipt from "../models/Receipt.model.js";
import Product from "../models/Product.model.js";
import StockLedger from "../models/StockLedger.model.js";

// @desc    Create new receipt (draft)
// @route   POST /api/v1/receipts
// @access  Private
export const createReceipt = async (req, res) => {
  try {
    const receiptData = {
      ...req.body,
      status: "Draft",
      createdBy: req.user.id
    };

    const receipt = await Receipt.create(receiptData);

    res.status(201).json({
      success: true,
      message: "Receipt created successfully",
      data: receipt
    });
  } catch (error) {
    console.error("Create receipt error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create receipt",
      error: error.message
    });
  }
};

// @desc    Get all receipts with filters
// @route   GET /api/v1/receipts
// @access  Private
export const getReceipts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      warehouseId,
      supplier,
      startDate,
      endDate
    } = req.query;

    // Build filter
    const filter = {};
    
    if (status) filter.status = status;
    if (warehouseId) filter.warehouseId = warehouseId;
    if (supplier) filter["supplier.name"] = new RegExp(supplier, "i");
    
    if (startDate || endDate) {
      filter.receiptDate = {};
      if (startDate) filter.receiptDate.$gte = new Date(startDate);
      if (endDate) filter.receiptDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const receipts = await Receipt.find(filter)
      .populate("warehouseId", "name code")
      .populate("createdBy", "name email")
      .populate("validatedBy", "name email")
      .populate("items.productId", "name sku")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Receipt.countDocuments(filter);

    res.json({
      success: true,
      data: receipts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get receipts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch receipts",
      error: error.message
    });
  }
};

// @desc    Get single receipt by ID
// @route   GET /api/v1/receipts/:id
// @access  Private
export const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate("warehouseId", "name code location")
      .populate("createdBy", "name email")
      .populate("validatedBy", "name email")
      .populate("canceledBy", "name email")
      .populate("items.productId", "name sku category unitOfMeasure");

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found"
      });
    }

    res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error("Get receipt by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch receipt",
      error: error.message
    });
  }
};

// @desc    Update draft receipt
// @route   PUT /api/v1/receipts/:id
// @access  Private
export const updateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found"
      });
    }

    // Only allow updates on draft receipts
    if (receipt.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft receipts can be updated"
      });
    }

    const updatedReceipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("warehouseId", "name code")
     .populate("items.productId", "name sku");

    res.json({
      success: true,
      message: "Receipt updated successfully",
      data: updatedReceipt
    });
  } catch (error) {
    console.error("Update receipt error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update receipt",
      error: error.message
    });
  }
};

// @desc    Validate receipt (add to stock)
// @route   POST /api/v1/receipts/:id/validate
// @access  Private
export const validateReceipt = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate("items.productId");

    if (!receipt) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Receipt not found"
      });
    }

    if (receipt.status === "Done") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Receipt is already validated"
      });
    }

    if (receipt.status === "Canceled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Cannot validate canceled receipt"
      });
    }

    // Update received quantities (either from request or use expected)
    const items = req.body.items || receipt.items.map(item => ({
      productId: item.productId._id,
      receivedQuantity: item.expectedQuantity,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      location: item.location,
      unitCost: item.unitCost
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

      const previousStock = product.currentStock;
      const delta = item.receivedQuantity;

      // Create ledger entry
      await StockLedger.createEntry({
        productId: product._id,
        warehouseId: receipt.warehouseId,
        delta,
        previousStock,
        type: "receipt",
        referenceId: receipt._id,
        referenceModel: "Receipt",
        referenceNumber: receipt.receiptNumber,
        performedBy: req.user.id,
        note: `Receipt from ${receipt.supplier.name}`,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        unitCost: item.unitCost
      });

      // Update product warehouse stock
      const warehouseStockIndex = product.warehouseStock.findIndex(
        ws => ws.warehouseId.toString() === receipt.warehouseId.toString()
      );

      if (warehouseStockIndex >= 0) {
        product.warehouseStock[warehouseStockIndex].quantity += delta;
        if (item.location) {
          product.warehouseStock[warehouseStockIndex].location = item.location;
        }
      } else {
        product.warehouseStock.push({
          warehouseId: receipt.warehouseId,
          quantity: delta,
          location: item.location
        });
      }

      product.currentStock += delta;
      await product.save({ session });
    }

    // Update receipt status
    receipt.status = "Done";
    receipt.validatedBy = req.user.id;
    receipt.validatedAt = new Date();
    
    // Update item received quantities
    items.forEach(item => {
      const receiptItem = receipt.items.find(
        i => i.productId._id.toString() === item.productId.toString()
      );
      if (receiptItem) {
        receiptItem.receivedQuantity = item.receivedQuantity;
        if (item.batchNumber) receiptItem.batchNumber = item.batchNumber;
        if (item.expiryDate) receiptItem.expiryDate = item.expiryDate;
        if (item.location) receiptItem.location = item.location;
        if (item.unitCost) receiptItem.unitCost = item.unitCost;
      }
    });

    await receipt.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Receipt validated successfully",
      data: receipt
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Validate receipt error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate receipt",
      error: error.message
    });
  }
};

// @desc    Cancel draft receipt
// @route   DELETE /api/v1/receipts/:id
// @access  Private
export const cancelReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found"
      });
    }

    if (receipt.status === "Done") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel validated receipt"
      });
    }

    if (receipt.status === "Canceled") {
      return res.status(400).json({
        success: false,
        message: "Receipt is already canceled"
      });
    }

    receipt.status = "Canceled";
    receipt.canceledBy = req.user.id;
    receipt.canceledAt = new Date();
    receipt.cancelReason = req.body.reason || "Canceled by user";

    await receipt.save();

    res.json({
      success: true,
      message: "Receipt canceled successfully",
      data: receipt
    });
  } catch (error) {
    console.error("Cancel receipt error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel receipt",
      error: error.message
    });
  }
};