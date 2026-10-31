import 'dotenv/config';
import mongoose from 'mongoose';
import Clinic from './models/Clinic.js';

const clinics = [
  {
    name: 'Atlas Heart Center',
    specialty: 'Cardiology',
    city: 'Casablanca',
    address: '12 Boulevard Zerktouni, Casablanca',
    mapUrl: 'https://www.google.com/maps?q=Casablanca&output=embed',
    description: 'A modern cardiology clinic offering diagnostics, follow-up and preventive care.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    phone: '+212 522 000 001',
    email: 'contact@atlasheart.example',
    workingHours: 'Mon-Fri 09:00 - 18:00',
    consultationPrice: 400,
    doctor: {
      name: 'Dr. Yassine El Amrani',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      bio: 'Cardiologist with 15 years of experience in preventive cardiology.',
    },
    services: [
      { name: 'Consultation', price: 400 },
      { name: 'ECG', price: 250 },
      { name: 'Echocardiography', price: 700 },
    ],
  },
  {
    name: 'Bright Smile Dental',
    specialty: 'Dentistry',
    city: 'Agadir',
    address: '45 Avenue Hassan II, Agadir',
    mapUrl: 'https://www.google.com/maps?q=Agadir&output=embed',
    description: 'Family dental care, whitening and orthodontics in a calm, friendly space.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
    phone: '+212 528 000 002',
    email: 'hello@brightsmile.example',
    workingHours: 'Mon-Sat 09:00 - 19:00',
    consultationPrice: 200,
    doctor: {
      name: 'Dr. Salma Benjelloun',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
      bio: 'Dental surgeon specialized in cosmetic dentistry and orthodontics.',
    },
    services: [
      { name: 'Check-up', price: 200 },
      { name: 'Teeth cleaning', price: 350 },
      { name: 'Whitening', price: 1200 },
    ],
  },
  {
    name: 'Little Steps Pediatrics',
    specialty: 'Pediatrics',
    city: 'Marrakech',
    address: '8 Rue de la Liberté, Gueliz, Marrakech',
    mapUrl: 'https://www.google.com/maps?q=Marrakech&output=embed',
    description: 'Gentle care for babies, children and teenagers.',
    image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800',
    phone: '+212 524 000 003',
    email: 'info@littlesteps.example',
    workingHours: 'Mon-Fri 08:30 - 17:30',
    consultationPrice: 300,
    doctor: {
      name: 'Dr. Karim Alaoui',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      bio: 'Pediatrician passionate about child development and vaccination.',
    },
    services: [
      { name: 'Consultation', price: 300 },
      { name: 'Vaccination', price: 150 },
      { name: 'Growth follow-up', price: 250 },
    ],
  },
  {
    name: 'Clear Skin Dermatology',
    specialty: 'Dermatology',
    city: 'Casablanca',
    address: '30 Rue Ibn Sina, Maarif, Casablanca',
    mapUrl: 'https://www.google.com/maps?q=Maarif+Casablanca&output=embed',
    description: 'Medical and aesthetic dermatology for all skin types.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    phone: '+212 522 000 004',
    email: 'contact@clearskin.example',
    workingHours: 'Tue-Sat 10:00 - 18:00',
    consultationPrice: 350,
    doctor: {
      name: 'Dr. Nadia Fassi',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      bio: 'Dermatologist focused on acne, eczema and skin cancer screening.',
    },
    services: [
      { name: 'Consultation', price: 350 },
      { name: 'Mole screening', price: 300 },
      { name: 'Acne treatment', price: 500 },
    ],
  },
];

await mongoose.connect(process.env.MONGO_URI);
await Clinic.deleteMany({});
await Clinic.insertMany(clinics);
console.log('Seeded', clinics.length, 'clinics');
await mongoose.disconnect();