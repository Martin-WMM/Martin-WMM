const revealTargets = document.querySelectorAll('.reveal');
const yearNode = document.querySelector('#year');
const loadingOverlay = document.querySelector('#loading-overlay');

const hideLoadingOverlay = () => {
  if (!(loadingOverlay instanceof HTMLElement)) {
    return;
  }

  loadingOverlay.classList.add('hidden');
};

const renderLatexFormula = () => {
  if (typeof window.renderMathInElement !== 'function') {
    return;
  }

  window.renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    throwOnError: false,
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideLoadingOverlay, { once: true });
} else {
  hideLoadingOverlay();
}

window.addEventListener('load', hideLoadingOverlay, { once: true });
window.addEventListener('load', renderLatexFormula, { once: true });

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
    rootMargin: '0px 0px -20px 0px',
  }
);

revealTargets.forEach((element) => {
  revealObserver.observe(element);
});

const canvas = document.querySelector('#particle-canvas');

if (canvas instanceof HTMLCanvasElement) {
  const context = canvas.getContext('2d');

  if (context) {
    let width = 0;
    let height = 0;
    let animationFrameId = 0;

    const particleCount = 40;
    const particles = Array.from({ length: particleCount }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.55 + 0.15,
    }));

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particles.forEach((particle) => {
        particle.x = Math.random() * width;
        particle.y = Math.random() * height;
      });
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(122, 168, 255, ${particle.alpha})`;
        context.fill();
      });

      animationFrameId = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('beforeunload', () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    });
  }
}
