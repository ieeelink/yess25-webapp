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
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import AddEvent from "./pages/AddEvent";
import AddUpdate from "./pages/AddUpdate";
import EventDetails from "./pages/EventDetails";
import Updates from "./pages/Updates";
import TestLandingSection from "./components/TestLandingSection";
import React from "react";


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
        await axios.get('https://yess25-backend.up.railway.app/api/admin/verify', {
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

function TestTicketPage() {
  const [showCheckStatus, setShowCheckStatus] = React.useState(false);
  return (
    <>
      <TestLandingSection onOpenCheckStatus={() => setShowCheckStatus(true)} />
      {showCheckStatus && (
        <div className="fixed inset-0 z-[9999] flex items-start px-2 md:items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 md:pt-0">
          <CheckStatus onClose={() => setShowCheckStatus(false)} />
        </div>
      )}
    </>
  );
}

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showCheckStatus, setShowCheckStatus] = useState(false);

  // Disable background scroll when any overlay/modal is open
  React.useEffect(() => {
    if (showOverlay || showTicketForm || showCheckStatus) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Clean up on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [showOverlay, showTicketForm, showCheckStatus]);

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
        <Route path="/test-ticket" element={<TestTicketPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/*" element={<ProtectedRoute />}>
          <Route path="add" element={<AddAdmin />} />
          <Route path="ticket-details" element={<TicketDetails />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="add-update" element={<AddUpdate />} />
          <Route path="event-details" element={<EventDetails />} />
          <Route path="updates" element={<Updates />} />
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
        <Route path="/ToS" element={<ToS />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterWrapper />
      <Overlay visible={showOverlay} onClose={() => setShowOverlay(false)} />
    </Router>
  );
}

export default App;
