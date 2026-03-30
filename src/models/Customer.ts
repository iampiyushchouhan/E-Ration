import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  faceDescriptor: { type: [Number] } // Stored 128D array from face-api
});

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true }, // e.g., "12001"
  members: [memberSchema]
});

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
