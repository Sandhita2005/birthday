(function () {
  /* ============================================================
     1. CONFETTI
  ============================================================ */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let animationId = null;
  const maxParticles = 260;
  const colors = ['#FFD966', '#FFB347', '#FF6F61', '#FF8C42', '#FFE28C', '#FF4D6D', '#C1FF9B', '#7FDBFF', '#E0BBE4', '#fff2a8'];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class ConfettiParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 10 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 9;
      this.speedY = (Math.random() * -9) - 4;
      this.gravity = 0.22;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 15;
      this.opacity = 1;
      this.life = 1.0;
      this.decay = 0.008 + Math.random() * 0.01;
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }

    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.life -= this.decay;
      this.opacity = Math.max(0, this.life);
      this.speedX *= 0.99;
      return this.life > 0.05;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
      ctx.shadowBlur = 15;
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function createBurst(originX, originY, count = 40) {
    const available = maxParticles - particles.length;
    const toAdd = Math.min(count, available);
    for (let i = 0; i < toAdd; i++) {
      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 100;
      particles.push(new ConfettiParticle(originX + offsetX, originY + offsetY));
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (!p.update()) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }
    if (particles.length > 0) {
      animationId = requestAnimationFrame(animateConfetti);
    } else {
      animationId = null;
    }
  }

  function startAnimation() {
    if (!animationId && particles.length > 0) {
      animationId = requestAnimationFrame(animateConfetti);
    }
  }

  /* ============================================================
     2. BACKGROUND SPARKLES
  ============================================================ */
  const sparkleContainer = document.getElementById('sparkles');
  function createSparkles(count = 60) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 3) + 's';
      s.style.animationDuration = (2 + Math.random() * 3) + 's';
      const colorsList = ['#ffd966', '#ffb347', '#ff6f61', '#ffffff', '#ff4d6d'];
      s.style.background = colorsList[Math.floor(Math.random() * colorsList.length)];
      sparkleContainer.appendChild(s);
    }
  }
  createSparkles();

  /* ============================================================
     3. ELEMENTS
  ============================================================ */
  const celebrateBtn = document.getElementById('celebrateBtn');
  const popupOverlay = document.getElementById('popupOverlay');
  const popupClose = document.getElementById('popupClose');
  const bgMusic = document.getElementById('bgMusic');
  const startOverlay = document.getElementById('startOverlay');
  const startBtn = document.getElementById('startBtn');

  let musicTimer = null;

  /* ============================================================
     4. MUSIC CONTROL (30 seconds)
  ============================================================ */
  function playMusicFor30Seconds() {
    if (musicTimer) clearTimeout(musicTimer);
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.7;
    const p = bgMusic.play();
    if (p !== undefined) {
      p.catch(err => console.log('Audio blocked:', err));
    }
    musicTimer = setTimeout(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }, 30000);
  }

  function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    if (musicTimer) {
      clearTimeout(musicTimer);
      musicTimer = null;
    }
  }

  /* ============================================================
     5. POPUP OPEN / CLOSE
  ============================================================ */
  function openPopup() {
    popupOverlay.classList.add('active');
  }

  function closePopup() {
    popupOverlay.classList.remove('active');
    stopMusic();
  }

  /* ============================================================
     6. CELEBRATE FUNCTION → 🎵 music + confetti + popup
  ============================================================ */
  function triggerCelebration() {
    const rect = celebrateBtn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    createBurst(originX, originY, 70);
    setTimeout(() => {
      createBurst(window.innerWidth * 0.15, window.innerHeight * 0.25, 35);
      createBurst(window.innerWidth * 0.85, window.innerHeight * 0.25, 35);
    }, 90);
    setTimeout(() => {
      createBurst(window.innerWidth * 0.5, window.innerHeight * 0.75, 40);
      createBurst(window.innerWidth * 0.5, window.innerHeight * 0.15, 40);
    }, 180);
    setTimeout(() => {
      createBurst(window.innerWidth * 0.3, window.innerHeight * 0.5, 30);
      createBurst(window.innerWidth * 0.7, window.innerHeight * 0.5, 30);
    }, 260);

    startAnimation();

    // 🎵 Play music on this real user click
    playMusicFor30Seconds();

    // Show popup with the photo
    openPopup();

    celebrateBtn.style.transform = 'scale(0.94)';
    setTimeout(() => { celebrateBtn.style.transform = ''; }, 130);
  }

  celebrateBtn.addEventListener('click', triggerCelebration);

  /* ============================================================
     7. START OVERLAY → just hides, no music
  ============================================================ */
  startBtn.addEventListener('click', () => {
    startOverlay.classList.add('hidden');
  });

  /* ============================================================
     8. PAGE LOAD MINI CELEBRATION
  ============================================================ */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      createBurst(cx, cy, 40);
      startAnimation();
    }, 400);
  });

  /* ============================================================
     9. POPUP CLOSE EVENTS
  ============================================================ */
  popupClose.addEventListener('click', closePopup);
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) closePopup();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
      closePopup();
    }
  });
})();