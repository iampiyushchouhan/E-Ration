import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  memberName: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true }, // e.g., "09:00 AM - 10:00 AM"
  referenceNumber: { type: String, required: true, unique: true }, // e.g., "RJ58001"
  qrToken: { type: String, required: true },
  status: { type: String, default: 'BOOKED' },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to enforce 1 booking per ID per date
bookingSchema.index({ customerId: 1, date: 1 }, { unique: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
