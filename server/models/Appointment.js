import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    fullName: { type: String, required: true, trim: true },
    govId: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    hour: { type: String, default: '' },    // optional, HH:MM
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);