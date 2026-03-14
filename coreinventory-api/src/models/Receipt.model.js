import mongoose from "mongoose";

const receiptItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"]
  },
  expectedQuantity: {
    type: Number,
    required: [true, "Expected quantity is required"],
    min: [1, "Quantity must be at least 1"]
  },
  receivedQuantity: {
    type: Number,
    default: 0,
    min: [0, "Received quantity cannot be negative"]
  },
  unitCost: {
    type: Number,
    min: [0, "Unit cost cannot be negative"],
    default: 0
  },
  batchNumber: {
    type: String,
    trim: true,
    maxlength: [50, "Batch number cannot exceed 50 characters"]
  },
  expiryDate: {
    type: Date
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

const receiptSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: [true, "Receipt number is required"],
    unique: true,  // This creates the index automatically
    trim: true,
    uppercase: true
  },
  supplier: {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      maxlength: [200, "Supplier name cannot exceed 200 characters"]
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
  items: [receiptItemSchema],
  status: {
    type: String,
    enum: ["Draft", "Waiting", "Ready", "Done", "Canceled"],
    default: "Draft"
  },
  receiptDate: {
    type: Date,
    default: Date.now
  },
  expectedDeliveryDate: {
    type: Date
  },
  referenceNumber: {
    type: String,
    trim: true,
    maxlength: [50, "Reference number cannot exceed 50 characters"]
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
receiptSchema.virtual("totalItems").get(function() {
  return this.items.length;
});

// Virtual for total expected quantity
receiptSchema.virtual("totalExpectedQuantity").get(function() {
  return this.items.reduce((sum, item) => sum + item.expectedQuantity, 0);
});

// Virtual for total received quantity
receiptSchema.virtual("totalReceivedQuantity").get(function() {
  return this.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
});

// Virtual for completion percentage
receiptSchema.virtual("completionPercentage").get(function() {
  if (this.totalExpectedQuantity === 0) return 0;
  return (this.totalReceivedQuantity / this.totalExpectedQuantity) * 100;
});

// Pre-save middleware to generate receipt number
receiptSchema.pre("save", async function(next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const count = await mongoose.model("Receipt").countDocuments() + 1;
    this.receiptNumber = `REC-${year}${month}-${count.toString().padStart(4, "0")}`;
  }
  next();
});

// Keep only non-unique indexes here
receiptSchema.index({ status: 1 });
receiptSchema.index({ warehouseId: 1 });
receiptSchema.index({ receiptDate: -1 });
receiptSchema.index({ "supplier.name": 1 });

export default mongoose.model("Receipt", receiptSchema);
