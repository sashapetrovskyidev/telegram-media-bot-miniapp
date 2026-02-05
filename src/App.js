import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { init, ready } from '@tma.js/sdk';
import MainMenu from './components/MainMenu';
import MusicStudio from './components/MusicStudio';

function App() {
  const [themeParams, setThemeParams] = useState({});

  useEffect(() => {
    init();
    ready();
    
    const tg = window.Telegram.WebApp;
    tg.expand();
    
    const theme = tg.themeParams || {};
    setThemeParams(theme);

    const user = tg.initDataUnsafe?.user;
    if (user) {
      console.log('User:', user);
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