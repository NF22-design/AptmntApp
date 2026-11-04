import 'dotenv/config';
import mongoose from 'mongoose';
import Clinic from './models/Clinic.js';

/* ---------- Seeded random helpers (same data on every run) ---------- */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2024); // change the number to get a different dataset
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (a, b) => a + Math.floor(rand() * (b - a + 1));
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const round10 = (n) => Math.round(n / 10) * 10;
const slug = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');

/* ---------- Data pools ---------- */
const prefixes = [
  'Atlas', 'Medina', 'Al Amal', 'Nour', 'Salam', 'Riad', 'Oasis', 'Horizon', 'Zenith',
  'Sahara', 'Anfa', 'Andalus', 'Yasmine', 'Jasmine', 'Cedar', 'Olive', 'Argan', 'Saphir',
  'Menara', 'Kasbah', 'Al Baraka', 'Al Shifa', 'Tamouda', 'Souss', 'Rif',
];

const cities = [
  { name: 'Casablanca', code: 522, factor: 1.15, areas: ['Maarif', 'Gauthier', 'Anfa', 'Ain Diab'] },
  { name: 'Rabat', code: 537, factor: 1.15, areas: ['Agdal', 'Hassan', 'Souissi', 'Hay Riad'] },
  { name: 'Marrakech', code: 524, factor: 1.1, areas: ['Gueliz', 'Hivernage', 'Mhamid', 'Targa'] },
  { name: 'Agadir', code: 528, factor: 1.0, areas: ['Founty', 'Talborjt', 'Hay Mohammadi', 'Secteur Touristique'] },
  { name: 'Fes', code: 535, factor: 0.9, areas: ['Ville Nouvelle', 'Atlas', 'Narjiss', 'Route d\'Imouzzer'] },
  { name: 'Tangier', code: 539, factor: 0.95, areas: ['Malabata', 'Iberia', 'Marshan', 'Boukhalef'] },
  { name: 'Meknes', code: 535, factor: 0.85, areas: ['Hamria', 'Marjane', 'Sidi Baba', 'Ville Nouvelle'] },
  { name: 'Oujda', code: 536, factor: 0.85, areas: ['Centre Ville', 'Al Qods', 'Lazaret', 'Hay Andalous'] },
  { name: 'Tetouan', code: 539, factor: 0.85, areas: ['Martil Road', 'Ensanche', 'Wilaya', 'Mhannech'] },
  { name: 'Kenitra', code: 537, factor: 0.85, areas: ['Centre Ville', 'Bir Rami', 'Mehdia Road', 'Ouled Oujih'] },
];

const streets = [
  'Avenue Mohammed V', 'Boulevard Hassan II', 'Rue Ibn Sina', 'Avenue des FAR',
  'Boulevard Zerktouni', 'Rue Allal Ben Abdellah', 'Avenue Mohammed VI',
  'Rue de la Liberte', 'Boulevard Al Massira', 'Rue Al Qods',
];

const maleNames = ['Yassine', 'Karim', 'Omar', 'Mehdi', 'Hamza', 'Anas', 'Rachid', 'Adil', 'Youssef', 'Mustapha', 'Amine', 'Hicham', 'Tarik', 'Said', 'Reda'];
const femaleNames = ['Salma', 'Nadia', 'Imane', 'Sara', 'Houda', 'Meryem', 'Khadija', 'Laila', 'Zineb', 'Hajar', 'Sanae', 'Fatima', 'Ghita', 'Amal', 'Soukaina'];
const lastNames = ['El Amrani', 'Benjelloun', 'Alaoui', 'Fassi', 'Tazi', 'Bennani', 'Berrada', 'Lahlou', 'Chraibi', 'El Idrissi', 'Ouazzani', 'Skalli', 'Mansouri', 'Kettani', 'Benkirane', 'Zniber', 'Sebti', 'Naciri', 'Hajji', 'Bouazza'];

const hoursOptions = [
  'Mon-Fri 09:00 - 18:00',
  'Mon-Fri 08:30 - 17:30',
  'Mon-Sat 09:00 - 19:00',
  'Mon-Sat 10:00 - 18:00',
  'Tue-Sat 10:00 - 18:00',
  'Mon-Fri 09:00 - 13:00 / 15:00 - 19:00',
];

/* Each specialty: name variants, doctor title, focus areas, and a pool of services
   (the first one is always "Consultation"; prices are base prices in MAD). */
const specialties = [
  {
    name: 'Cardiology', title: 'Cardiologist',
    suffixes: ['Heart Center', 'Cardiology Clinic', 'Cardio Care'],
    focus: ['preventive cardiology', 'heart failure', 'hypertension', 'cardiac imaging'],
    description: 'Diagnostics, follow-up and preventive care for heart and vascular health.',
    services: [['Consultation', 400], ['ECG', 250], ['Echocardiography', 700], ['Stress test', 650], ['Holter monitoring', 600], ['Blood pressure monitoring', 450]],
  },
  {
    name: 'Dentistry', title: 'Dental surgeon',
    suffixes: ['Dental', 'Smile Clinic', 'Dental Care'],
    focus: ['cosmetic dentistry', 'orthodontics', 'implantology', 'family dentistry'],
    description: 'Family dental care, whitening and orthodontics in a calm, friendly space.',
    services: [['Check-up', 200], ['Teeth cleaning', 350], ['Whitening', 1200], ['Filling', 300], ['Root canal', 800], ['Dental implant', 5000]],
  },
  {
    name: 'Pediatrics', title: 'Pediatrician',
    suffixes: ['Pediatrics', 'Kids Clinic', 'Children\'s Care'],
    focus: ['child development', 'vaccination', 'newborn care', 'childhood allergies'],
    description: 'Gentle, attentive care for babies, children and teenagers.',
    services: [['Consultation', 300], ['Vaccination', 150], ['Growth follow-up', 250], ['Newborn check-up', 350], ['Allergy test', 500], ['School health certificate', 150]],
  },
  {
    name: 'Dermatology', title: 'Dermatologist',
    suffixes: ['Dermatology', 'Skin Clinic', 'Skin Care Center'],
    focus: ['acne and eczema', 'skin cancer screening', 'aesthetic dermatology', 'hair disorders'],
    description: 'Medical and aesthetic dermatology for all skin types.',
    services: [['Consultation', 350], ['Mole screening', 300], ['Acne treatment', 500], ['Chemical peel', 700], ['Wart removal', 400], ['Hair loss treatment', 600]],
  },
  {
    name: 'Ophthalmology', title: 'Ophthalmologist',
    suffixes: ['Eye Center', 'Vision Clinic', 'Ophthalmology'],
    focus: ['cataract surgery', 'glaucoma', 'retina care', 'pediatric ophthalmology'],
    description: 'Complete eye exams, vision correction and surgical eye care.',
    services: [['Consultation', 350], ['Vision test', 200], ['Eye pressure test', 250], ['Fundus exam', 400], ['Visual field test', 450], ['Contact lens fitting', 300]],
  },
  {
    name: 'Orthopedics', title: 'Orthopedic surgeon',
    suffixes: ['Orthopedic Center', 'Bone & Joint Clinic', 'Orthopedics'],
    focus: ['sports injuries', 'knee and hip surgery', 'spine care', 'trauma surgery'],
    description: 'Treatment of bone, joint and muscle conditions, from diagnosis to rehabilitation.',
    services: [['Consultation', 400], ['X-ray', 250], ['Joint injection', 600], ['Cast / splint', 500], ['Physiotherapy session', 300], ['Ultrasound', 450]],
  },
  {
    name: 'Gynecology', title: 'Gynecologist',
    suffixes: ['Women\'s Health Center', 'Gynecology Clinic', 'Maternity Care'],
    focus: ['prenatal care', 'fertility', 'minimally invasive surgery', 'preventive screening'],
    description: 'Complete women\'s health care, from routine check-ups to pregnancy follow-up.',
    services: [['Consultation', 350], ['Pelvic ultrasound', 400], ['Pregnancy follow-up', 450], ['Pap smear', 300], ['Contraception counseling', 250], ['Fertility assessment', 800]],
  },
  {
    name: 'ENT', title: 'ENT specialist',
    suffixes: ['ENT Clinic', 'Ear Nose & Throat Center', 'ENT Care'],
    focus: ['sinus disorders', 'hearing loss', 'sleep apnea', 'pediatric ENT'],
    description: 'Diagnosis and treatment of ear, nose and throat conditions for all ages.',
    services: [['Consultation', 300], ['Hearing test', 250], ['Nasal endoscopy', 450], ['Ear cleaning', 150], ['Allergy testing', 500], ['Sleep apnea screening', 700]],
  },
  {
    name: 'Neurology', title: 'Neurologist',
    suffixes: ['Neuro Center', 'Neurology Clinic', 'Brain & Nerve Care'],
    focus: ['migraine and headaches', 'epilepsy', 'stroke prevention', 'movement disorders'],
    description: 'Specialized care for disorders of the brain, spine and nervous system.',
    services: [['Consultation', 450], ['EEG', 600], ['EMG', 700], ['Migraine management', 500], ['Memory assessment', 650], ['Follow-up visit', 300]],
  },
  {
    name: 'General Medicine', title: 'General practitioner',
    suffixes: ['Medical Center', 'Family Clinic', 'Health Center'],
    focus: ['family medicine', 'chronic disease follow-up', 'preventive health', 'emergency care'],
    description: 'Your first stop for check-ups, everyday health concerns and referrals.',
    services: [['Consultation', 200], ['Full check-up', 500], ['Blood test', 250], ['Vaccination', 150], ['Medical certificate', 100], ['Home visit', 450]],
  },
];

/* ---------- Generator ---------- */
function buildClinic(spec, city, name) {
  const gender = rand() < 0.5 ? 'men' : 'women';
  const first = pick(gender === 'men' ? maleNames : femaleNames);
  const doctorName = `Dr. ${first} ${pick(lastNames)}`;
  const years = between(6, 28);

  const clinicFactor = 0.8 + rand() * 0.5; // clinic price level: 0.8x - 1.3x
  const [consultation, ...others] = spec.services;
  const chosen = [consultation, ...shuffle(others).slice(0, 3)].map(([sName, base]) => ({
    name: sName,
    price: round10(base * city.factor * clinicFactor),
  }));

  const address = `${between(1, 150)} ${pick(streets)}, ${pick(city.areas)}, ${city.name}`;
  const phoneBlock = () => String(between(100, 999));

  return {
    name,
    specialty: spec.name,
    city: city.name,
    address,
    mapUrl: `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`,
    description: spec.description,
    image: `https://picsum.photos/seed/${slug(name)}/800/500`,
    phone: `+212 ${city.code} ${phoneBlock()} ${phoneBlock()}`,
    email: `contact@${slug(name)}.example`,
    workingHours: pick(hoursOptions),
    consultationPrice: chosen[0].price,
    doctor: {
      name: doctorName,
      image: `https://randomuser.me/api/portraits/${gender}/${between(0, 99)}.jpg`,
      bio: `${spec.title} with ${years} years of experience, specialized in ${pick(spec.focus)}.`,
    },
    services: chosen,
  };
}

const clinics = [];
for (const spec of specialties) {
  // 20 unique prefixes per specialty -> every clinic name is unique
  const names = shuffle(prefixes).slice(0, 20).map((p) => `${p} ${pick(spec.suffixes)}`);
  let i = 0;
  for (const city of cities) {
    for (let n = 0; n < 2; n++) {
      clinics.push(buildClinic(spec, city, names[i++]));
    }
  }
}

/* ---------- Insert ---------- */
await mongoose.connect(process.env.MONGO_URI);
await Clinic.deleteMany({});
await Clinic.insertMany(clinics);
console.log(`Seeded ${clinics.length} clinics`);
await mongoose.disconnect();