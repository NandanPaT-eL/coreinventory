import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [200, "Name cannot exceed 200 characters"]
  },
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,  // This creates the index automatically
    trim: true,
    uppercase: true,
    maxlength: [50, "SKU cannot exceed 50 characters"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
    maxlength: [100, "Category cannot exceed 100 characters"]
  },
  unitOfMeasure: {
    type: String,
    required: [true, "Unit of measure is required"],
    enum: ['piece', 'kg', 'g', 'lb', 'oz', 'liter', 'ml', 'gallon', 'box', 'pack', 'dozen', 'meter', 'foot', 'inch'],
    default: 'piece'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  reorderPoint: {
    type: Number,
    min: [0, "Reorder point cannot be negative"],
    default: 10
  },
  reorderQuantity: {
    type: Number,
    min: [1, "Reorder quantity must be at least 1"],
    default: 50
  },
  initialStock: {
    type: Number,
    default: 0,
    min: [0, "Initial stock cannot be negative"]
  },
  currentStock: {
    type: Number,
    default: 0,
    min: [0, "Current stock cannot be negative"]
  },
  price: {
    type: Number,
    min: [0, "Price cannot be negative"],
    default: 0
  },
  cost: {
    type: Number,
    min: [0, "Cost cannot be negative"],
    default: 0
  },
  image: {
    type: String,
    default: null
  },
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  warehouseStock: [{
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"]
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for low stock status
productSchema.virtual("isLowStock").get(function() {
  return this.currentStock <= this.reorderPoint;
});

// Virtual for out of stock status
productSchema.virtual("isOutOfStock").get(function() {
  return this.currentStock === 0;
});

// Only keep non-unique indexes here
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ currentStock: 1 });
productSchema.index({ "warehouseStock.warehouseId": 1 });

export default mongoose.model("Product", productSchema);
