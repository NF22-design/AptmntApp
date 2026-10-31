import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getClinic } from '../api';

export default function ClinicDetails() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getClinic(id).then(setClinic).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!clinic) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container details">
      <Link to="/clinics">← Back to clinics</Link>
      <img className="cover" src={clinic.image} alt={clinic.name} />

      <div className="title-row">
        <div>
          <span className="tag">{clinic.specialty}</span>
          <h2>{clinic.name}</h2>
          <p>📍 {clinic.address}, {clinic.city}</p>
        </div>
        <Link to={`/clinics/${clinic._id}/book`} className="cta small">Take appointment</Link>
      </div>

      <p>{clinic.description}</p>

      <div className="two-col">
        <section className="box">
          <h3>Doctor in charge</h3>
          <div className="doctor">
            <img src={clinic.doctor?.image} alt={clinic.doctor?.name} />
            <div>
              <strong>{clinic.doctor?.name}</strong>
              <p>{clinic.doctor?.bio}</p>
            </div>
          </div>
        </section>

        <section className="box">
          <h3>Contact</h3>
          <p>📞 {clinic.phone}</p>
          <p>✉️ {clinic.email}</p>
          <p>🕒 {clinic.workingHours}</p>
        </section>
      </div>

      <section className="box">
        <h3>Services & prices</h3>
        <table>
          <tbody>
            {clinic.services.map((s) => (
              <tr key={s.name}><td>{s.name}</td><td className="right">{s.price} MAD</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {clinic.mapUrl && (
        <section className="box">
          <h3>Location</h3>
          <iframe title="map" src={clinic.mapUrl} className="map" loading="lazy" />
        </section>
      )}
    </div>
  );
}