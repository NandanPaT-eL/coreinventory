import mongoose from 'mongoose';

const transferItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  fromLocation: {
    type: String,
    trim: true,
    default: ''
  },
  toLocation: {
    type: String,
    trim: true,
    default: ''
  },
  batchNumber: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false });

const transferSchema = new mongoose.Schema({
  transferNumber: {
    type: String,
    required: true,
    unique: true
  },
  fromWarehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  toWarehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  items: [transferItemSchema],
  status: {
    type: String,
    enum: ['Draft', 'Done', 'Canceled'],
    default: 'Draft'
  },
  scheduledDate: {
    type: Date
  },
  transferDate: {
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

// Generate transfer number before saving
transferSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Transfer').countDocuments();
    const sequence = (count + 1).toString().padStart(4, '0');
    this.transferNumber = `TRF-${year}${month}-${sequence}`;
  }
  next();
});

const Transfer = mongoose.model('Transfer', transferSchema);
export default Transfer;
