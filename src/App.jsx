import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Status from './pages/Status';
import CheckStatus from './pages/CheckStatus';
import PaymentCallback from './pages/PaymentCallback';
import PaymentCancelled from './pages/PaymentCancelled';
import AboutSection from './components/sections/AboutSection';
import { useEffect, useState } from 'react';
import Highlights from './components/sections/Highlights';
import ToS from './pages/ToS';
import Privacy from './pages/Privacy';
import AdminLogin from './pages/AdminLogin';
import AddAdmin from './pages/AddAdmin';
import TicketDetails from './pages/TicketDetails';
import axios from 'axios';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import Overlay from './components/Overlay';

const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.open(to, '_blank', 'noopener,noreferrer');
    window.history.back();
  }, [to]);

  return null;
};

function ProtectedRoute() {
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsVerified(false);
        return;
      }
      try {
        await axios.get('http://localhost:3001/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsVerified(true);
      } catch {
        localStorage.removeItem('token');
        setIsVerified(false);
      }
    };
    verifyToken();
  }, []);

  if (isVerified === null) {
    return <div className="text-white text-center text-2xl h-screen flex items-center justify-center">Verifying...</div>;
  }
  return isVerified ? <Outlet /> : <Navigate to="/admin" replace />;
}

function App() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path='/paymentStatus' element={<Status />} />
          <Route path='/checkStatus' element={<CheckStatus/>} />
          <Route path='/payment-callback' element={<PaymentCallback />} />
          <Route path='/payment-cancelled' element={<PaymentCancelled />} />
          <Route path='/aboutus' element={<AboutSection/>} />
          <Route path='/highlights24' element={<Highlights/>}/>
          <Route path='/gallery' element={<Gallery/>}/>
          <Route path='/tos' element={<ToS/>}/>
          <Route path='/privacy' element={<Privacy/>}/>
          <Route path="/admin" element={<AdminLogin/>}/>
          <Route path="/admin/*" element={<ProtectedRoute />}>
            <Route path="add" element={<AddAdmin/>}/>
            <Route path="ticket-details" element={<TicketDetails/>}/>
          </Route>
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
      <Overlay visible={showOverlay} onClose={() => setShowOverlay(false)} />
    </>
  );
}

export default App;
