import { useEffect, useRef, useCallback } from 'react';

// ─── Types ───
interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  thickness: number;
  opacity: number;
  layer: number; // 0 = far background, 1 = mid, 2 = foreground
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  life: number;
  particles: { angle: number; dist: number; size: number }[];
}

interface CloudPuff {
  ox: number; // offset from cloud center
  oy: number;
  r: number;
  opacity: number;
}

interface Cloud {
  x: number;
  y: number;
  speed: number;
  width: number;
  puffs: CloudPuff[];
  baseOpacity: number;
  shadowY: number;
}

interface MistLayer {
  y: number;
  opacity: number;
  speed: number;
  offset: number;
}

export function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // ─── Rain Layers ───
    // 3 depth layers: far (thin, slow, faint), mid, near (thick, fast, bright)
    const layerConfig = [
      { count: 60, speedMin: 1.5, speedMax: 3, lengthMin: 8, lengthMax: 16, thicknessMin: 0.3, thicknessMax: 0.6, opacityMin: 0.04, opacityMax: 0.1 },
      { count: 45, speedMin: 3, speedMax: 5.5, lengthMin: 14, lengthMax: 26, thicknessMin: 0.5, thicknessMax: 1.0, opacityMin: 0.08, opacityMax: 0.18 },
      { count: 25, speedMin: 5, speedMax: 8, lengthMin: 22, lengthMax: 40, thicknessMin: 0.8, thicknessMax: 1.6, opacityMin: 0.12, opacityMax: 0.25 },
    ];

    let drops: RainDrop[] = [];
    let splashes: Splash[] = [];
    let clouds: Cloud[] = [];
    let mist: MistLayer[] = [];

    // ─── Wind ───
    let windAngle = 0.15; // radians, slight tilt
    let windTarget = 0.15;
    let windGust = 0;

    // ─── Lightning ───
    let lightningFlash = 0;
    let lightningTimer = Math.random() * 600 + 300; // frames until next flash

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    // ─── Initialization ───
    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      populate();
    };

    const populate = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Rain drops
      drops = [];
      layerConfig.forEach((cfg, layer) => {
        for (let i = 0; i < cfg.count; i++) {
          drops.push({
            x: rand(-50, w + 50),
            y: rand(-h * 0.3, h),
            speed: rand(cfg.speedMin, cfg.speedMax),
            length: rand(cfg.lengthMin, cfg.lengthMax),
            thickness: rand(cfg.thicknessMin, cfg.thicknessMax),
            opacity: rand(cfg.opacityMin, cfg.opacityMax),
            layer,
          });
        }
      });

      // Clouds
      clouds = [];
      const cloudCount = Math.max(2, Math.floor(w / 350));
      for (let i = 0; i < cloudCount; i++) {
        clouds.push(createCloud(w, h, i, cloudCount));
      }

      // Mist layers
      mist = [];
      for (let i = 0; i < 3; i++) {
        mist.push({
          y: h * (0.7 + i * 0.1),
          opacity: 0.03 + i * 0.015,
          speed: rand(0.1, 0.3),
          offset: rand(0, Math.PI * 2),
        });
      }

      splashes = [];
    };

    const createCloud = (w: number, h: number, index: number, total: number): Cloud => {
      const cloudWidth = rand(120, 220);
      const puffs: CloudPuff[] = [];
      const puffCount = Math.floor(rand(8, 14));

      // Build a natural cloud shape: wider in the middle, flatter bottom, puffy top
      for (let i = 0; i < puffCount; i++) {
        const t = i / (puffCount - 1); // 0 to 1
        const spreadX = cloudWidth * 0.5;
        const ox = (t - 0.5) * cloudWidth + rand(-spreadX * 0.15, spreadX * 0.15);
        // Top puffs rise up, bottom stays flat
        const oyBase = rand(-25, 5);
        const oy = oyBase - Math.abs(t - 0.5) * rand(5, 20); // arch up toward center
        const r = rand(18, 38) * (1 - Math.abs(t - 0.5) * 0.4); // bigger in center
        const opacity = rand(0.5, 0.9);
        puffs.push({ ox, oy, r, opacity });
      }
      // Add some extra bottom-fill puffs for flat base
      for (let i = 0; i < 4; i++) {
        puffs.push({
          ox: rand(-cloudWidth * 0.35, cloudWidth * 0.35),
          oy: rand(0, 10),
          r: rand(20, 32),
          opacity: rand(0.3, 0.6),
        });
      }

      return {
        x: index === 0 ? w * 0.3 : rand(-cloudWidth, w + cloudWidth),
        y: rand(h * 0.05, h * 0.22),
        speed: rand(0.08, 0.25),
        width: cloudWidth,
        puffs,
        baseOpacity: rand(0.06, 0.12),
        shadowY: rand(15, 30),
      };
    };

    // ─── Splash creation ───
    const createSplash = (x: number, y: number) => {
      const particleCount = Math.floor(rand(3, 6));
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          angle: rand(-Math.PI * 0.8, -Math.PI * 0.2), // upward arc
          dist: 0,
          size: rand(0.5, 1.5),
        });
      }
      splashes.push({
        x,
        y,
        radius: 0,
        maxRadius: rand(3, 7),
        opacity: rand(0.15, 0.3),
        life: 1.0,
        particles,
      });
    };

    // ─── Drawing ───
    const drawCloud = (cloud: Cloud) => {
      ctx.save();

      // Cloud shadow (dark underside)
      cloud.puffs.forEach((puff) => {
        const gradient = ctx.createRadialGradient(
          cloud.x + puff.ox, cloud.y + puff.oy + cloud.shadowY, 0,
          cloud.x + puff.ox, cloud.y + puff.oy + cloud.shadowY, puff.r * 1.2
        );
        gradient.addColorStop(0, `rgba(0, 0, 0, ${cloud.baseOpacity * puff.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cloud.x + puff.ox, cloud.y + puff.oy + cloud.shadowY, puff.r * 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Main cloud body — layered radial gradients for volumetric look
      cloud.puffs.forEach((puff) => {
        const cx = cloud.x + puff.ox;
        const cy = cloud.y + puff.oy;

        // Outer soft glow
        const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, puff.r * 1.3);
        outerGrad.addColorStop(0, `rgba(255, 255, 255, ${cloud.baseOpacity * puff.opacity * 0.6})`);
        outerGrad.addColorStop(0.5, `rgba(255, 255, 255, ${cloud.baseOpacity * puff.opacity * 0.3})`);
        outerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, puff.r * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core (top-lit)
        const innerGrad = ctx.createRadialGradient(
          cx, cy - puff.r * 0.25, puff.r * 0.1,
          cx, cy, puff.r * 0.8
        );
        innerGrad.addColorStop(0, `rgba(255, 255, 255, ${cloud.baseOpacity * puff.opacity * 1.2})`);
        innerGrad.addColorStop(0.6, `rgba(230, 230, 240, ${cloud.baseOpacity * puff.opacity * 0.5})`);
        innerGrad.addColorStop(1, 'rgba(200, 200, 220, 0)');
        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, puff.r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle warm brand tint on the underside
      cloud.puffs.forEach((puff) => {
        if (puff.oy > -5) {
          const cx = cloud.x + puff.ox;
          const cy = cloud.y + puff.oy + 5;
          const tintGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, puff.r * 0.7);
          tintGrad.addColorStop(0, `rgba(228, 73, 13, ${cloud.baseOpacity * 0.15})`);
          tintGrad.addColorStop(1, 'rgba(228, 73, 13, 0)');
          ctx.fillStyle = tintGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, puff.r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.restore();
    };

    const drawRain = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Wind oscillation
      time++;
      windTarget = 0.12 + Math.sin(time * 0.003) * 0.08 + windGust;
      windAngle += (windTarget - windAngle) * 0.02;

      // Occasional gusts
      if (Math.random() < 0.002) windGust = rand(-0.05, 0.12);
      windGust *= 0.99; // decay

      const sinW = Math.sin(windAngle);
      const cosW = Math.cos(windAngle);

      drops.forEach((d) => {
        const layerSpeedMult = [0.6, 1, 1.5][d.layer];
        const dx = sinW * d.speed * layerSpeedMult * 1.5;
        const dy = cosW * d.speed * layerSpeedMult;

        // Draw streak
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + sinW * d.length, d.y + cosW * d.length);

        // Color: slightly blue-white for realism
        const r = 200 + d.layer * 25;
        const g = 210 + d.layer * 20;
        const b = 230 + d.layer * 10;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${d.opacity})`;
        ctx.lineWidth = d.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Move
        d.x += dx;
        d.y += dy;

        // Reset when off screen
        if (d.y > h + 10) {
          // Create splash for foreground drops
          if (d.layer === 2 && Math.random() < 0.3) {
            createSplash(d.x, h - rand(2, 8));
          }
          d.y = rand(-60, -10);
          d.x = rand(-50, w + 100);
          d.speed = rand(
            layerConfig[d.layer].speedMin,
            layerConfig[d.layer].speedMax
          );
        }
        if (d.x < -80) d.x = w + rand(10, 50);
        if (d.x > w + 80) d.x = rand(-50, 0);
      });
    };

    const drawSplashes = () => {
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];

        // Expanding ring
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(220, 225, 240, ${s.opacity * s.life})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Splash particles flying up
        s.particles.forEach((p) => {
          const px = s.x + Math.cos(p.angle) * p.dist;
          const py = s.y + Math.sin(p.angle) * p.dist;
          ctx.beginPath();
          ctx.arc(px, py, p.size * s.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 225, 240, ${s.opacity * s.life * 0.8})`;
          ctx.fill();
          p.dist += rand(0.3, 0.8);
        });

        // Animate
        s.radius += (s.maxRadius - s.radius) * 0.15;
        s.life -= 0.04;

        if (s.life <= 0) splashes.splice(i, 1);
      }
    };

    const drawMist = () => {
      const w = canvas.width;
      const h = canvas.height;

      mist.forEach((m) => {
        const waveX = Math.sin(time * 0.005 + m.offset) * 30;
        const gradient = ctx.createLinearGradient(0, m.y - 40, 0, h);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.3, `rgba(200, 195, 210, ${m.opacity * (0.7 + Math.sin(time * 0.003 + m.offset) * 0.3)})`);
        gradient.addColorStop(1, `rgba(180, 175, 195, ${m.opacity * 0.5})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(waveX - 30, m.y - 40, w + 60, h - m.y + 40);
      });
    };

    const drawLightning = () => {
      lightningTimer--;
      if (lightningTimer <= 0) {
        lightningFlash = 1.0;
        lightningTimer = rand(400, 900); // next flash
      }

      if (lightningFlash > 0) {
        // Full-screen flash overlay
        ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlash * 0.06})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Flash bolt (very brief)
        if (lightningFlash > 0.7) {
          const boltX = rand(canvas.width * 0.2, canvas.width * 0.8);
          const boltY = 0;
          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${lightningFlash * 0.15})`;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = 'rgba(200, 200, 255, 0.3)';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(boltX, boltY);

          let cy = boltY;
          let cx = boltX;
          const segments = Math.floor(rand(4, 8));
          for (let i = 0; i < segments; i++) {
            cx += rand(-25, 25);
            cy += rand(20, canvas.height / segments);
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();
          ctx.restore();
        }

        lightningFlash *= 0.85; // fade out
        if (lightningFlash < 0.01) lightningFlash = 0;
      }
    };

    // ─── Main Loop ───
    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Clouds (background)
      clouds.forEach((c) => {
        drawCloud(c);
        c.x -= c.speed;
        if (c.x < -c.width - 100) {
          c.x = canvas.width + c.width + rand(50, 200);
          c.y = rand(canvas.height * 0.04, canvas.height * 0.2);
        }
      });

      // 2. Rain (three layers)
      drawRain();

      // 3. Splashes
      drawSplashes();

      // 4. Ground mist
      drawMist();

      // 5. Lightning
      drawLightning();

      animId = requestAnimationFrame(frame);
    };

    window.addEventListener('resize', resize);
    resize();
    frame();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1] mix-blend-screen"
      style={{ opacity: 0.75 }}
    />
  );
}
