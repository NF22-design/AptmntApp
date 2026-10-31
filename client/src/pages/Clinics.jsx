import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClinics, getFilters } from '../api';

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [filters, setFilters] = useState({ specialties: [], cities: [] });
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getFilters().then(setFilters).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getClinics({ specialty, city })
      .then((data) => { setClinics(data); setError(''); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [specialty, city]);

  return (
    <div className="container">
      <h2>Find a clinic</h2>

      <div className="filters">
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
          <option value="">All specialties</option>
          {filters.specialties.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All cities</option>
          {filters.cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        {(specialty || city) && (
          <button className="btn-link" onClick={() => { setSpecialty(''); setCity(''); }}>
            Clear filters
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && clinics.length === 0 && <p>No clinics match your filters.</p>}

      <div className="grid">
        {clinics.map((c) => (
          <Link to={`/clinics/${c._id}`} key={c._id} className="card">
            <img src={c.image} alt={c.name} />
            <div className="card-body">
              <span className="tag">{c.specialty}</span>
              <h3>{c.name}</h3>
              <p>📍 {c.city}</p>
              <p>👨‍⚕️ {c.doctor?.name}</p>
              <p className="price">From {c.consultationPrice} MAD</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}