import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TermsOfService from './pages/TermsOfService';
import Tickets from './pages/Tickets';
import Status from './pages/Status';
import { useEffect } from 'react';

const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.open(to, '_blank', 'noopener,noreferrer');
    window.history.back();
  }, [to]);

  return null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<ExternalRedirect to="https://www.ieee-link.org/" />} />
        <Route path="/tos" element={<TermsOfService />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path='/paymentStatus' element={<Status />} />
      </Routes>
    </Router>
  );
}

export default App;
