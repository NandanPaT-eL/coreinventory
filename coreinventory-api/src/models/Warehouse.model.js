// backend/src/models/Warehouse.model.js - Updated version
import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Warehouse name is required"],
    trim: true,
    unique: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  code: {
    type: String,
    required: [true, "Warehouse code is required"],
    trim: true,
    unique: true,
    uppercase: true,
    maxlength: [20, "Code cannot exceed 20 characters"]
  },
  location: {
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"]
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, "City cannot exceed 50 characters"]
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, "State cannot exceed 50 characters"]
    },
    country: {
      type: String,
      trim: true,
      maxlength: [50, "Country cannot exceed 50 characters"]
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [20, "ZIP code cannot exceed 20 characters"]
    }
  },
  contact: {
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone cannot exceed 20 characters"]
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email"
      ]
    },
    manager: {
      type: String,
      trim: true,
      maxlength: [100, "Manager name cannot exceed 100 characters"]
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
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

warehouseSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "warehouseId",
  count: true
});

// Remove duplicate indexes - keep only these for search optimization
// The unique indexes are already created by unique: true in schema
warehouseSchema.index({ isActive: 1 });
warehouseSchema.index({ "location.city": 1 });
warehouseSchema.index({ "location.country": 1 });

export default mongoose.model("Warehouse", warehouseSchema);