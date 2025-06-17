import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ResponsiveHome from '../components/ResponsiveHome';

function Home() {
  const location = useLocation();

  useEffect(() => {
    const { state } = location;
    if (state?.section) {
      const section = document.getElementById(state.section);
      if (section) {
        const container = document.querySelector('.scrollbar-hide');
        if (container) {
          container.scrollTo({
            left: section.offsetLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [location]);

  return <ResponsiveHome />;
}

export default Home;