import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero">
      <h1>Your health, one click away</h1>
      <p>
        Browse trusted clinics, compare services and prices, and book your
        appointment in under a minute. No account needed.
      </p>
      <Link to="/clinics" className="cta">Choose now!</Link>
      <div className="features">
        <div><h3>🔎 Find</h3><p>Filter clinics by specialty and city.</p></div>
        <div><h3>📋 Compare</h3><p>See services, prices and doctors.</p></div>
        <div><h3>📅 Book</h3><p>Get your receipt instantly.</p></div>
      </div>
    </section>
  );
}