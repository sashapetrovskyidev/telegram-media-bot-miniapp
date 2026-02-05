import { useNavigate } from 'react-router-dom';

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      background: '#111',
      color: '#0f0'
    }}>
      <img 
        src="/character.png" 
        alt="Producer" 
        style={{ 
          width: '150px', 
          height: 'auto',
          imageRendering: 'pixelated',
          marginBottom: '30px',
          animation: 'float 3s infinite ease-in-out'
        }}
      />
      <h1>Pixel Beat Studio</h1>
      <button 
        onClick={() => navigate('/studio')}
        style={{
          padding: '15px 40px',
          fontSize: '24px',
          background: '#00ccff',
          color: 'black',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        PLAY
      </button>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
