import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du restaurant est requis'],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    address: {
      type: String,
      required: [true, "L'adresse est requise"],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    phone: {
      type: String,
      default: '',
    },
    openingHours: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Index pour recherche textuelle
RestaurantSchema.index({ name: 'text', address: 'text' });

export default mongoose.model('Restaurant', RestaurantSchema);
