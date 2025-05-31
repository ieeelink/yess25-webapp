import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Status from './pages/Status';
import CheckStatus from './pages/CheckStatus';
import AboutSection from './components/sections/AboutSection';
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
          <Route path="/tickets" element={<Tickets />} />
          <Route path='/paymentStatus' element={<Status />} />
          <Route path='/checkStatus' element={<CheckStatus/>} />
          <Route path='/aboutus' element={<AboutSection/>} />

      </Routes>
    </Router>
  );
}

export default App;
