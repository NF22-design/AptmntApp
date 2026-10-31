import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createAppointment, getClinic } from '../api';
import { downloadReceipt } from '../receipt';

const today = new Date().toISOString().slice(0, 10);

export default function Book() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [form, setForm] = useState({ fullName: '', govId: '', phone: '', date: '', hour: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    getClinic(id).then(setClinic).catch((e) => setError(e.message));
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const appt = await createAppointment({ clinicId: id, ...form });
      setAppointment(appt);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!clinic && !error) return <div className="container"><p>Loading...</p></div>;

  if (appointment) {
    return (
      <div className="container narrow">
        <div className="box success">
          <h2>✅ Appointment confirmed</h2>
          <p><strong>{appointment.fullName}</strong>, your appointment at <strong>{appointment.clinicName}</strong> is booked for <strong>{appointment.date}</strong>{appointment.hour && ` at ${appointment.hour}`}.</p>
          <button className="cta small" onClick={() => downloadReceipt(appointment)}>
            Download receipt
          </button>
          <p><Link to="/clinics">Back to clinics</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="container narrow">
      <Link to={`/clinics/${id}`}>← Back</Link>
      <h2>Book at {clinic?.name}</h2>

      <form className="box form" onSubmit={onSubmit}>
        <label>Full name
          <input name="fullName" value={form.fullName} onChange={onChange} required />
        </label>
        <label>Government ID
          <input name="govId" value={form.govId} onChange={onChange} required />
        </label>
        <label>Phone number
          <input name="phone" type="tel" value={form.phone} onChange={onChange} required />
        </label>
        <label>Date
          <input name="date" type="date" min={today} value={form.date} onChange={onChange} required />
        </label>
        <label>Hour <small>(optional)</small>
          <input name="hour" type="time" value={form.hour} onChange={onChange} />
        </label>

        {error && <p className="error">{error}</p>}
        <button className="cta small" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}