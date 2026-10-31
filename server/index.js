import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Clinic from './models/Clinic.js';
import Appointment from './models/Appointment.js';

const app = express();
app.use(cors());
app.use(express.json());

// List clinics (optional filters: ?specialty=&city=)
app.get('/api/clinics', async (req, res) => {
  try {
    const { specialty, city } = req.query;
    const filter = {};
    if (specialty) filter.specialty = specialty;
    if (city) filter.city = city;
    const clinics = await Clinic.find(filter).select('-services').sort('name');
    res.json(clinics);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Values for the filter dropdowns
app.get('/api/clinics/meta/filters', async (req, res) => {
  try {
    const [specialties, cities] = await Promise.all([
      Clinic.distinct('specialty'),
      Clinic.distinct('city'),
    ]);
    res.json({ specialties: specialties.sort(), cities: cities.sort() });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Clinic details
app.get('/api/clinics/:id', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json(clinic);
  } catch (e) {
    res.status(400).json({ message: 'Invalid clinic id' });
  }
});

// Create appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { clinicId, fullName, govId, phone, date, hour } = req.body;

    if (!clinicId || !fullName?.trim() || !govId?.trim() || !phone?.trim() || !date) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date.' });
    }
    const today = new Date().toISOString().slice(0, 10);
    if (date < today) {
      return res.status(400).json({ message: 'Date cannot be in the past.' });
    }
    if (hour && !/^([01]\d|2[0-3]):[0-5]\d$/.test(hour)) {
      return res.status(400).json({ message: 'Invalid hour.' });
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });

    const appt = await Appointment.create({
      clinic: clinic._id,
      fullName,
      govId,
      phone,
      date,
      hour: hour || '',
    });

    res.status(201).json({
      id: appt._id,
      fullName: appt.fullName,
      govId: appt.govId,
      phone: appt.phone,
      date: appt.date,
      hour: appt.hour,
      clinicName: clinic.name,
      createdAt: appt.createdAt,
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`API running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('Mongo connection error:', err));