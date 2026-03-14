import mongoose from 'mongoose';

const adjustmentItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  expectedQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  countedQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    enum: ['damage', 'loss', 'theft', 'found', 'correction', 'other'],
    default: 'correction'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false });

const adjustmentSchema = new mongoose.Schema({
  adjustmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  items: [adjustmentItemSchema],
  status: {
    type: String,
    enum: ['Draft', 'Done', 'Canceled'],
    default: 'Draft'
  },
  adjustmentDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  validatedAt: {
    type: Date
  },
  canceledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  canceledAt: {
    type: Date
  },
  cancelReason: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Generate adjustment number before saving
adjustmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Adjustment').countDocuments();
    const sequence = (count + 1).toString().padStart(4, '0');
    this.adjustmentNumber = `ADJ-${year}${month}-${sequence}`;
  }
  next();
});

const Adjustment = mongoose.model('Adjustment', adjustmentSchema);
export default Adjustment;
