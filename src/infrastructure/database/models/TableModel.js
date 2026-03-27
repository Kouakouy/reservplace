import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Le restaurant est requis'],
    },
    number: {
      type: Number,
      required: [true, 'Le numéro de table est requis'],
    },
    capacity: {
      type: Number,
      required: [true, 'La capacité est requise'],
      min: [1, 'La capacité minimum est 1'],
      max: [50, 'La capacité maximum est 50'],
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index composite pour éviter les doublons (restaurant + numéro de table)
TableSchema.index({ restaurant: 1, number: 1 }, { unique: true });

export default mongoose.model('Table', TableSchema);
