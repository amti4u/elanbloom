/**
 * ÉLAN BLOOM — Haute Floristry & Digital Art Atelier
 * Interactive 3D Floating Flower & Ambient Pollen Atmosphere
 *
 * Features:
 * - Direct render of the high-res iridescent flower cutout from Photo 1
 * - Weightless dual-harmonic levitation floating animation
 * - Interactive 3D perspective tilt reacting to cursor and touch drag
 * - Dynamic angle-dependent specular drop-shadow & illumination shift
 * - Atmospheric glowing 3D pollen dust motes drifting in the mountain air
 * - Performance optimized: IntersectionObserver auto-pauses when off-screen
 * - Full prefers-reduced-motion support
 */

(function () {
  'use strict';

  const container = document.getElementById('flower-3d-container');
  const flowerImg = document.getElementById('hero-flower-visual');
  const haloGlow = container ? container.querySelector('.flower-halo-glow') : null;
  const particleCanvas = document.getElementById('hero-particles-canvas');

  if (!container || !flowerImg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animation State
  let isVisible = true;
  let animFrameId = null;

  // Rotation & Position Physics
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;
  let currentRotZ = 0;

  // Drag physics
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let dragRotX = 0;
  let dragRotY = 0;
  let dragVelX = 0;
  let dragVelY = 0;

  // Particle System
  let ctx = null;
  let canvasW = 0;
  let canvasH = 0;
  const particles = [];
  const PARTICLE_COUNT = 48;

  if (particleCanvas) {
    ctx = particleCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    initParticles();
  }

  function resizeCanvas() {
    if (!particleCanvas) return;
    const rect = container.getBoundingClientRect();
    canvasW = rect.width * 1.5;
    canvasH = rect.height * 1.5;
    particleCanvas.width = canvasW * (window.devicePixelRatio || 1);
    particleCanvas.height = canvasH * (window.devicePixelRatio || 1);
    if (ctx) {
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * (canvasW || 600),
        y: Math.random() * (canvasH || 600),
        z: Math.random() * 200 - 100,
        radius: Math.random() * 2.2 + 0.8,
        baseAlpha: Math.random() * 0.5 + 0.25,
        alpha: 0,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.55 - 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.4 ? 'gold' : 'lavender'
      });
    }
  }

  // Mouse move listener across the window for cinematic parallax
  window.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;

    targetRotY = normX * 22; // max ±11 deg tilt
    targetRotX = -normY * 18; // max ±9 deg tilt
  }, { passive: true });

  // Drag Interaction on the Flower
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    dragVelX = 0;
    dragVelY = 0;
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;

    dragVelX = dx * 0.35;
    dragVelY = dy * 0.35;

    dragRotY += dragVelX;
    dragRotX -= dragVelY;

    dragRotY = Math.max(-35, Math.min(35, dragRotY));
    dragRotX = Math.max(-25, Math.min(25, dragRotX));
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'grab';
  });

  // Touch Drag Interaction
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragVelX = 0;
      dragVelY = 0;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    dragVelX = dx * 0.3;
    dragVelY = dy * 0.3;

    dragRotY += dragVelX;
    dragRotX -= dragVelY;
    dragRotY = Math.max(-30, Math.min(30, dragRotY));
    dragRotX = Math.max(-20, Math.min(20, dragRotX));
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Main Render Loop
  let lastTime = performance.now();

  function render(time) {
    if (!isVisible) {
      animFrameId = requestAnimationFrame(render);
      return;
    }

    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    // Organic Floating Oscillation (Dual Harmonics)
    let floatY = 0;
    let floatRotZ = 0;
    if (!prefersReducedMotion) {
      floatY = Math.sin(time * 0.0016) * 9.0 + Math.sin(time * 0.0008) * 3.5;
      floatRotZ = Math.sin(time * 0.0011) * 1.6;
    }

    // Spring interpolation toward target tilt
    if (!isDragging) {
      dragRotX *= 0.92;
      dragRotY *= 0.92;
    }

    const combinedTargetX = targetRotX + dragRotX;
    const combinedTargetY = targetRotY + dragRotY;

    currentRotX += (combinedTargetX - currentRotX) * 0.08;
    currentRotY += (combinedTargetY - currentRotY) * 0.08;
    currentRotZ += (floatRotZ - currentRotZ) * 0.08;

    // Apply 3D Transform to Flower Image
    const transformStr = 'perspective(1100px) translateY(' + floatY.toFixed(2) + 'px) rotateX(' + currentRotX.toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) rotateZ(' + currentRotZ.toFixed(2) + 'deg)';
    flowerImg.style.transform = transformStr;

    // Dynamic Specular Illumination & Shadow Shift based on rotation
    const shadowX = (-currentRotY * 1.2).toFixed(1);
    const shadowY = (35 + currentRotX * 0.8).toFixed(1);
    flowerImg.style.filter = 'drop-shadow(' + shadowX + 'px ' + shadowY + 'px 45px rgba(255, 140, 107, 0.38)) drop-shadow(' + (-shadowX) + 'px ' + shadowY + 'px 70px rgba(171, 146, 245, 0.28)) drop-shadow(0 40px 95px rgba(0, 0, 0, 0.7))';

    // Move Halo Glow subtly in counter-depth
    if (haloGlow) {
      const glowX = -currentRotY * 0.8;
      const glowY = currentRotX * 0.6 + floatY * 0.5;
      haloGlow.style.transform = 'translate(calc(-50% + ' + glowX.toFixed(1) + 'px), calc(-50% + ' + glowY.toFixed(1) + 'px))';
    }

    // Render Ambient Drifting Pollen Particles
    if (ctx && !prefersReducedMotion && canvasW > 0 && canvasH > 0) {
      ctx.clearRect(0, 0, canvasW, canvasH);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX + (currentRotY * 0.02);
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = canvasH + 10;
          p.x = Math.random() * canvasW;
        }
        if (p.x < -10) p.x = canvasW + 10;
        if (p.x > canvasW + 10) p.x = -10;

        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
        p.alpha = Math.max(0, p.baseAlpha * (0.6 + 0.4 * pulse));

        const depthScale = (p.z + 150) / 250;
        const drawRadius = Math.max(0.5, p.radius * depthScale);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);

        if (p.colorType === 'gold') {
          ctx.fillStyle = 'rgba(255, 205, 130, ' + p.alpha + ')';
          ctx.shadowColor = 'rgba(255, 175, 80, 0.7)';
        } else {
          ctx.fillStyle = 'rgba(200, 180, 255, ' + p.alpha + ')';
          ctx.shadowColor = 'rgba(170, 130, 255, 0.7)';
        }
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    animFrameId = requestAnimationFrame(render);
  }

  animFrameId = requestAnimationFrame(render);

  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }
})();
