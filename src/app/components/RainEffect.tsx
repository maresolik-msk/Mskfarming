import { useEffect, useRef } from 'react';

export function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Rain particles
    let particles: {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
      type: 'rain' | 'drop';
      size?: number;
    }[] = [];

    // Cloud definition
    let cloud: {
      x: number;
      y: number;
      speed: number;
      puffs: { x: number; y: number; r: number }[];
    } = { x: 0, y: 0, speed: 0, puffs: [] };
    
    // Configuration
    const rainCount = 100; 
    const dropCount = 30;
    const windSpeed = 0.8; // Positive value used to subtract from X, so wind blows LEFT
    
    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Rain streaks
      for (let i = 0; i < rainCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 2 + 3, // Faster falling
          length: Math.random() * 15 + 10,
          opacity: Math.random() * 0.2 + 0.1,
          type: 'rain'
        });
      }
      // Small droplets (slower, rounder)
      for (let i = 0; i < dropCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 1 + 1, // Slower
          length: 0,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.2,
          type: 'drop'
        });
      }

      // Initialize Cloud
      // A cloud is just a collection of overlapping circles
      const puffs = [];
      const puffCount = 6;
      for(let i=0; i<puffCount; i++) {
        puffs.push({
           x: (Math.random() - 0.5) * 80, // Spread width
           y: (Math.random() - 0.5) * 30, // Spread height
           r: Math.random() * 20 + 15     // Radius
        });
      }
      cloud = {
          x: canvas.width + 100, // Start off screen right
          y: canvas.height * 0.15 + 20, // Top area
          speed: windSpeed * 0.5, // Move slower than rain
          puffs
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Cloud First (Background)
      // Soft glow/blur for cloud
      ctx.save();
      // ctx.filter = 'blur(8px)'; // Performance heavy, maybe skip blur or use low value
      // Simple transparent fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      
      cloud.puffs.forEach(puff => {
          ctx.beginPath();
          ctx.arc(cloud.x + puff.x, cloud.y + puff.y, puff.r, 0, Math.PI * 2);
          ctx.fill();
      });
      ctx.restore();

      // Move Cloud
      cloud.x -= cloud.speed;
      // Reset Cloud
      if (cloud.x < -150) {
          cloud.x = canvas.width + 150;
          cloud.y = Math.random() * (canvas.height * 0.25) + 20;
      }

      // Draw Rain & Droplets
      particles.forEach(p => {
        ctx.beginPath();
        
        if (p.type === 'rain') {
            const windOffset = p.length * 0.2 * windSpeed; // Slant
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - windOffset, p.y + p.length);
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`; 
            ctx.lineWidth = 1;
            ctx.stroke();
            
            p.y += p.speed;
            p.x -= windSpeed * 2; // Movement
        } else {
            // Droplet
            ctx.arc(p.x, p.y, p.size!, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
            
            p.y += p.speed;
            p.x -= windSpeed; 
        }

        // Reset
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * (canvas.width + 200); 
        }
        if (p.x < -100) { // If blown left
            p.x = canvas.width + 50;
        } else if (p.x > canvas.width + 100) { // If blown right
            p.x = -50;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize(); // Initial sizing
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
      style={{ opacity: 0.6 }}
    />
  );
}
