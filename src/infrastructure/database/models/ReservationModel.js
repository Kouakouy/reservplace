import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'utilisateur est requis"],
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'La table est requise'],
    },
    date: {
      type: Date,
      required: [true, 'La date est requise'],
    },
    startTime: {
      type: String,
      required: [true, "L'heure de début est requise"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM requis'],
    },
    endTime: {
      type: String,
      required: [true, "L'heure de fin est requise"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM requis'],
    },
    guestCount: {
      type: Number,
      required: true,
      min: [1, 'Au moins 1 personne'],
      default: 1,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'CANCELLED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

// Index pour optimiser la vérification de conflits
ReservationSchema.index({ table: 1, date: 1, status: 1 });
// Index pour l'historique utilisateur
ReservationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Reservation', ReservationSchema);
