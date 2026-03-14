import mongoose from "mongoose";

const deliveryItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"]
  },
  orderedQuantity: {
    type: Number,
    required: [true, "Ordered quantity is required"],
    min: [1, "Quantity must be at least 1"]
  },
  deliveredQuantity: {
    type: Number,
    default: 0,
    min: [0, "Delivered quantity cannot be negative"]
  },
  unitPrice: {
    type: Number,
    min: [0, "Unit price cannot be negative"],
    default: 0
  },
  batchNumber: {
    type: String,
    trim: true,
    maxlength: [50, "Batch number cannot exceed 50 characters"]
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, "Location cannot exceed 100 characters"]
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, "Notes cannot exceed 200 characters"]
  }
});

const deliverySchema = new mongoose.Schema({
  deliveryNumber: {
    type: String,
    required: [true, "Delivery number is required"],
    unique: true,  // This creates the index automatically
    trim: true,
    uppercase: true
  },
  customer: {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [200, "Customer name cannot exceed 200 characters"]
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
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone cannot exceed 20 characters"]
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"]
    }
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: [true, "Warehouse is required"]
  },
  items: [deliveryItemSchema],
  status: {
    type: String,
    enum: ["Draft", "Waiting", "Ready", "Done", "Canceled"],
    default: "Draft"
  },
  deliveryDate: {
    type: Date,
    default: Date.now
  },
  requestedDeliveryDate: {
    type: Date
  },
  trackingNumber: {
    type: String,
    trim: true,
    maxlength: [50, "Tracking number cannot exceed 50 characters"]
  },
  carrier: {
    type: String,
    trim: true,
    maxlength: [100, "Carrier cannot exceed 100 characters"]
  },
  shippingMethod: {
    type: String,
    trim: true,
    maxlength: [50, "Shipping method cannot exceed 50 characters"]
  },
  shippingCost: {
    type: Number,
    min: [0, "Shipping cost cannot be negative"],
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, "Notes cannot exceed 500 characters"]
  },
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  validatedAt: {
    type: Date
  },
  canceledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  canceledAt: {
    type: Date
  },
  cancelReason: {
    type: String,
    trim: true,
    maxlength: [200, "Cancel reason cannot exceed 200 characters"]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items
deliverySchema.virtual("totalItems").get(function() {
  return this.items.length;
});

// Virtual for total ordered quantity
deliverySchema.virtual("totalOrderedQuantity").get(function() {
  return this.items.reduce((sum, item) => sum + item.orderedQuantity, 0);
});

// Virtual for total delivered quantity
deliverySchema.virtual("totalDeliveredQuantity").get(function() {
  return this.items.reduce((sum, item) => sum + item.deliveredQuantity, 0);
});

// Virtual for completion percentage
deliverySchema.virtual("completionPercentage").get(function() {
  if (this.totalOrderedQuantity === 0) return 0;
  return (this.totalDeliveredQuantity / this.totalOrderedQuantity) * 100;
});

// Virtual for total value
deliverySchema.virtual("totalValue").get(function() {
  return this.items.reduce((sum, item) => sum + (item.deliveredQuantity * item.unitPrice), 0);
});

// Pre-save middleware to generate delivery number
deliverySchema.pre("save", async function(next) {
  if (!this.deliveryNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const count = await mongoose.model("Delivery").countDocuments() + 1;
    this.deliveryNumber = `DEL-${year}${month}-${count.toString().padStart(4, "0")}`;
  }
  next();
});

// Keep only non-unique indexes here
deliverySchema.index({ status: 1 });
deliverySchema.index({ warehouseId: 1 });
deliverySchema.index({ deliveryDate: -1 });
deliverySchema.index({ "customer.name": 1 });
deliverySchema.index({ trackingNumber: 1 });

export default mongoose.model("Delivery", deliverySchema);
