// backend/src/models/StockLedger.model.js
import mongoose from "mongoose";

const stockLedgerSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
    index: true
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: [true, "Warehouse ID is required"],
    index: true
  },
  delta: {
    type: Number,
    required: [true, "Delta (quantity change) is required"],
    validate: {
      validator: function(value) {
        return value !== 0;
      },
      message: "Delta cannot be zero"
    }
  },
  previousStock: {
    type: Number,
    required: [true, "Previous stock is required"],
    min: 0
  },
  newStock: {
    type: Number,
    required: [true, "New stock is required"],
    min: 0
  },
  type: {
    type: String,
    required: [true, "Transaction type is required"],
    enum: {
      values: ['receipt', 'delivery', 'transfer_out', 'transfer_in', 'adjustment', 'initial'],
      message: '{VALUE} is not a valid transaction type'
    },
    index: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Reference ID is required"],
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    required: [true, "Reference model is required"],
    enum: ['Receipt', 'Delivery', 'Transfer', 'Adjustment', 'Product']
  },
  referenceNumber: {
    type: String,
    trim: true,
    index: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Performed by user is required"]
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, "Note cannot exceed 500 characters"]
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  batchNumber: {
    type: String,
    trim: true,
    maxlength: [50, "Batch number cannot exceed 50 characters"]
  },
  expiryDate: {
    type: Date
  },
  unitCost: {
    type: Number,
    min: 0
  },
  unitPrice: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for faster queries
stockLedgerSchema.index({ productId: 1, warehouseId: 1, createdAt: -1 });
stockLedgerSchema.index({ referenceId: 1, referenceModel: 1 });
stockLedgerSchema.index({ type: 1, createdAt: -1 });
stockLedgerSchema.index({ performedBy: 1, createdAt: -1 });
stockLedgerSchema.index({ batchNumber: 1 });
stockLedgerSchema.index({ expiryDate: 1 });

// Static method to create ledger entry
stockLedgerSchema.statics.createEntry = async function({
  productId,
  warehouseId,
  delta,
  previousStock,
  type,
  referenceId,
  referenceModel,
  referenceNumber,
  performedBy,
  note = '',
  metadata = {},
  batchNumber,
  expiryDate,
  unitCost,
  unitPrice
}) {
  const newStock = previousStock + delta;
  
  // Validate stock doesn't go negative
  if (newStock < 0) {
    throw new Error(`Insufficient stock. Current: ${previousStock}, Requested change: ${delta}`);
  }

  const entry = await this.create({
    productId,
    warehouseId,
    delta,
    previousStock,
    newStock,
    type,
    referenceId,
    referenceModel,
    referenceNumber,
    performedBy,
    note,
    metadata,
    batchNumber,
    expiryDate,
    unitCost,
    unitPrice
  });

  return entry;
};

// Static method to get stock movement for a product
stockLedgerSchema.statics.getProductMovements = async function(
  productId,
  { startDate, endDate, type, warehouseId, limit = 100, skip = 0 }
) {
  const query = { productId };
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }
  
  if (type) query.type = type;
  if (warehouseId) query.warehouseId = warehouseId;

  return this.find(query)
    .populate('warehouseId', 'name code')
    .populate('performedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get current stock for a product in a warehouse
stockLedgerSchema.statics.getCurrentStock = async function(productId, warehouseId) {
  const lastEntry = await this.findOne({
    productId,
    warehouseId
  })
    .sort({ createdAt: -1 })
    .select('newStock');

  return lastEntry ? lastEntry.newStock : 0;
};

// Static method to get stock valuation
stockLedgerSchema.statics.getStockValuation = async function(productId, warehouseId) {
  const pipeline = [
    {
      $match: {
        productId: mongoose.Types.ObjectId(productId),
        ...(warehouseId && { warehouseId: mongoose.Types.ObjectId(warehouseId) })
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$warehouseId',
        lastEntry: { $first: '$$ROOT' }
      }
    },
    {
      $lookup: {
        from: 'warehouses',
        localField: '_id',
        foreignField: '_id',
        as: 'warehouse'
      }
    },
    {
      $project: {
        warehouse: { $arrayElemAt: ['$warehouse', 0] },
        quantity: '$lastEntry.newStock',
        unitCost: '$lastEntry.unitCost',
        totalValue: { $multiply: ['$lastEntry.newStock', { $ifNull: ['$lastEntry.unitCost', 0] }] },
        lastUpdated: '$lastEntry.createdAt'
      }
    }
  ];

  return this.aggregate(pipeline);
};

// Static method to get daily movement summary
stockLedgerSchema.statics.getDailySummary = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: '$type',
        totalTransactions: { $sum: 1 },
        totalQuantity: { $sum: '$delta' },
        products: { $addToSet: '$productId' }
      }
    },
    {
      $project: {
        type: '$_id',
        totalTransactions: 1,
        totalQuantity: 1,
        uniqueProducts: { $size: '$products' }
      }
    }
  ];

  return this.aggregate(pipeline);
};

// Virtual for formatted timestamp
stockLedgerSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleString();
});

// Virtual for absolute delta (for display)
stockLedgerSchema.virtual('absoluteDelta').get(function() {
  return Math.abs(this.delta);
});

// Virtual for direction indicator
stockLedgerSchema.virtual('direction').get(function() {
  return this.delta > 0 ? 'in' : 'out';
});

// Pre-save middleware to validate stock doesn't go negative
stockLedgerSchema.pre('save', function(next) {
  if (this.newStock < 0) {
    next(new Error('Stock cannot be negative'));
  }
  next();
});

// Post-save middleware to update product's current stock
stockLedgerSchema.post('save', async function(doc) {
  try {
    const Product = mongoose.model('Product');
    const product = await Product.findById(doc.productId);
    
    if (product) {
      // Find the warehouse stock entry or create if doesn't exist
      const warehouseStockIndex = product.warehouseStock.findIndex(
        ws => ws.warehouseId.toString() === doc.warehouseId.toString()
      );

      if (warehouseStockIndex >= 0) {
        // Update existing warehouse stock
        product.warehouseStock[warehouseStockIndex].quantity = doc.newStock;
      } else {
        // Add new warehouse stock entry
        product.warehouseStock.push({
          warehouseId: doc.warehouseId,
          quantity: doc.newStock
        });
      }

      // Update total current stock
      product.currentStock = await mongoose.model('StockLedger').aggregate([
        {
          $match: { productId: doc.productId }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$delta' }
          }
        }
      ]).then(result => result[0]?.total || 0);

      await product.save();
    }
  } catch (error) {
    console.error('Error updating product stock from ledger:', error);
  }
});

export default mongoose.model("StockLedger", stockLedgerSchema);