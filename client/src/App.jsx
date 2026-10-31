import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Clinics from './pages/Clinics';
import ClinicDetails from './pages/ClinicDetails';
import Book from './pages/Book';

export default function App() {
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">➕ MediBook</Link>
        <Link to="/clinics">Clinics</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/clinics/:id" element={<ClinicDetails />} />
          <Route path="/clinics/:id/book" element={<Book />} />
        </Routes>
      </main>
    </>
  );
}