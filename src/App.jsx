import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Home2 from "./pages/Home2";
import Tickets from "./pages/Tickets";
import Status from "./pages/Status";
import CheckStatus from "./pages/CheckStatus";
import PaymentCallback from "./pages/PaymentCallback";
import PaymentCancelled from "./pages/PaymentCancelled";
import { useEffect, useState } from "react";
import ToS from "./pages/ToS";
import Privacy from "./pages/Privacy";
import AdminLogin from "./pages/AdminLogin";
import AddAdmin from "./pages/AddAdmin";
import TicketDetails from "./pages/TicketDetails";
import axios from "axios";
import NotFound from "./pages/NotFound";
import Overlay from "./components/Overlay";
import NewFooter from "./components/NewFooter";

const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.open(to, '_blank', 'noopener,noreferrer');
    window.history.back();
  }, [to]);

  return null;
};

const Redirect = ({ to }) => {
  useEffect(() => {
    window.location.replace(to);
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
        await axios.get('https://yess25-backend.railway.internal/api/admin/verify', {
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
    return <div className="flex items-center justify-center h-screen text-2xl text-center text-white">Verifying...</div>;
  }
  return isVerified ? <Outlet /> : <Navigate to="/admin" replace />;
}

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showCheckStatus, setShowCheckStatus] = useState(false);

  const closeAllPopups = () => {
    setShowTicketForm(false);
    setShowCheckStatus(false);
  };

  // FooterWrapper is a child of Router, so useLocation is safe here
  function FooterWrapper() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    if (isAdminRoute) return null;
    return <NewFooter onShowOverlay={() => setShowOverlay(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Home2
            showTicketForm={showTicketForm}
            setShowTicketForm={setShowTicketForm}
            showCheckStatus={showCheckStatus}
            setShowCheckStatus={setShowCheckStatus}
          />
        } />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/*" element={<ProtectedRoute />}>
          <Route path="add" element={<AddAdmin />} />
          <Route path="ticket-details" element={<TicketDetails />} />
        </Route>
        {/* Redirects */}
        <Route
          path="/call_for_events"
          element={<Redirect to="https://forms.gle/5XL2nyVjFCNBgnmt6" />}
        />
        <Route
          path="/mascot"
          element={<Redirect to="https://docs.google.com/forms/d/e/1FAIpQLScC_kUmGRZTPC3QGTtauYYYUIMgXWzevEGv9DiKqPDLO2dn0Q/viewform" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterWrapper />
      <Overlay visible={showOverlay} onClose={() => setShowOverlay(false)} />
    </Router>
  );
}

export default App;
