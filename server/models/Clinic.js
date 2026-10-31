import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  city: { type: String, required: true },
  address: String,
  mapUrl: String,
  description: String,
  image: String,
  phone: String,
  email: String,
  workingHours: String,
  doctor: {
    name: String,
    image: String,
    bio: String,
  },
  services: [{ name: String, price: Number }],
  consultationPrice: Number,
});

export default mongoose.model('Clinic', clinicSchema);