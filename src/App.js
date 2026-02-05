import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import MusicStudio from './components/MusicStudio';

function App() {
  const [themeParams, setThemeParams] = useState({});

  useEffect(() => {
    // Check if Telegram WebApp is available (for safety in non-Telegram environments)
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Expand the app to full height
      tg.expand();
      
      // Set theme params
      const theme = tg.themeParams || {};
      setThemeParams(theme);
      
      // Access user data
      const user = tg.initDataUnsafe?.user;
      if (user) {
        console.log('User:', user);
      }
      
      // Signal that the app is ready (optional, but good practice)
      tg.ready();
    } else {
      console.warn('Telegram WebApp not available. Running in a non-Telegram environment?');
    }
  }, []);

  return (
    <div style={{
      background: themeParams.bg_color || '#ffffff',
      color: themeParams.text_color || '#000000',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      <Router basename="/">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/studio" element={<MusicStudio />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
