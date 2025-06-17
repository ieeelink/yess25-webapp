import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Status from './pages/Status';
import CheckStatus from './pages/CheckStatus';
import AboutSection from './components/sections/AboutSection';
import { useEffect } from 'react';
import Highlights from './components/sections/Highlights';
import ToS from './pages/ToS';
import Privacy from './pages/Privacy'

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
          <Route path='/highlights24' element={<Highlights/>}/>
          <Route path='/tos' element={<ToS/>}/>
      <Route path='/privacy' element={<Privacy/>}/>
      </Routes>
    </Router>
  );
}

export default App;
