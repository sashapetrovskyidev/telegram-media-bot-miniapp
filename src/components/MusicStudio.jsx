import { useEffect, useRef, useState } from 'react';
import nipplejs from 'nipplejs';

export default function MusicStudio() {
  const canvasRef = useRef(null);
  const joystickRef = useRef(null);
  const [player, setPlayer] = useState({ x: 150, y: 300, width: 48, height: 72 });
  const [activeInstrument, setActiveInstrument] = useState(null);
  const [direction, setDirection] = useState({ x: 0, y: 0 });

  const instruments = [
    { name: 'Drums', x: 50, y: 200, width: 60, height: 60, color: '#ff4444' },
    { name: 'Synth', x: 200, y: 180, width: 50, height: 70, color: '#44ff44' },
    { name: 'Turntable', x: 300, y: 220, width: 55, height: 55, color: '#4488ff' },
  ];

  const SPEED = 3;
  const CANVAS_WIDTH = 360;
  const CANVAS_HEIGHT = 640;

  // Joystick for mobile
  useEffect(() => {
    const zone = joystickRef.current;
    if (!zone) return;

    const manager = nipplejs.create({
      zone,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'blue',
      size: 100,
    });

    manager.on('move', (evt, data) => {
      if (data.direction) {
        setDirection({
          x: data.direction.x === 'left' ? -1 : data.direction.x === 'right' ? 1 : 0,
          y: data.direction.y === 'up' ? -1 : data.direction.y === 'down' ? 1 : 0,
        });
      }
    });

    manager.on('end', () => setDirection({ x: 0, y: 0 }));

    return () => manager.destroy();
  }, []);

  // Key handling for desktop testing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        const near = instruments.find(inst => 
          Math.hypot(player.x - (inst.x + inst.width/2), player.y - (inst.y + inst.height/2)) < 80
        );
        if (near) {
          setActiveInstrument(near.name);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, instruments]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const loop = () => {
      // Clear
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw studio
      ctx.fillStyle = '#444';
      ctx.fillRect(0, CANVAS_HEIGHT - 80, CANVAS_WIDTH, 80); // floor

      // Draw instruments
      instruments.forEach(inst => {
        ctx.fillStyle = inst.color;
        ctx.fillRect(inst.x, inst.y, inst.width, inst.height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(inst.name, inst.x + 5, inst.y + 20);
      });

      // Move player
      let newX = player.x + direction.x * SPEED;
      let newY = player.y + direction.y * SPEED;

      newX = Math.max(0, Math.min(CANVAS_WIDTH - player.width, newX));
      newY = Math.max(0, Math.min(CANVAS_HEIGHT - player.height, newY));

      setPlayer({ ...player, x: newX, y: newY });

      // Draw player
      const img = new Image();
      img.src = '/character.png';
      if (img.complete) {
        ctx.drawImage(img, player.x, player.y, player.width, player.height);
      } else {
        img.onload = () => ctx.drawImage(img, player.x, player.y, player.width, player.height);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [direction, player]);

  // Touch interact
  const handleCanvasTouch = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;

    const near = instruments.find(inst => 
      touchX > inst.x && touchX < inst.x + inst.width &&
      touchY > inst.y && touchY < inst.y + inst.height
    );

    if (near) {
      setActiveInstrument(near.name);
    }
  };

  if (activeInstrument) {
    return (
      <div style={{ 
        height: '100vh', 
        background: '#000', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>{activeInstrument} Beat Maker</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', maxWidth: '300px' }}>
          {['Kick', 'Snare', 'Hi-hat', 'Clap'].map(sound => (
            <button 
              key={sound}
              onClick={() => {
                const audio = new Audio('/sounds/' + sound.toLowerCase() + '.mp3');
                audio.play();
              }}
              style={{ 
                padding: '20px', 
                fontSize: '16px', 
                background: '#333', 
                color: 'white', 
                border: '2px solid #0f0',
                borderRadius: '8px'
              }}
            >
              {sound}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setActiveInstrument(null)}
          style={{ marginTop: '30px', padding: '15px 40px', fontSize: '18px', background: '#ff4444' }}
        >
          CLOSE
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', maxWidth: '360px', margin: '0 auto', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        onTouchStart={handleCanvasTouch}
        style={{ display: 'block', background: '#000' }}
      />
      <div 
        ref={joystickRef} 
        style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '20px', 
          width: '150px', 
          height: '150px', 
          zIndex: 10 
        }} 
      />
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        color: 'white', 
        fontSize: '12px',
        zIndex: 10
      }}>
        Use joystick to move • Tap instrument to play
      </div>
    </div>
  );
}
