/* Simple Carousel JS
   Features: auto-slide, prev/next, indicators, hover pause, keyboard support
*/

(function () {
  const carousel = document.getElementById('carousel');
  const slidesEl = document.getElementById('slides');
  const slideNodes = Array.from(slidesEl.children);
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const indicatorsEl = document.getElementById('indicators');

  let current = 0;
  const total = slideNodes.length;
  const intervalMs = 4000; // auto-slide every 4s
  let timer = null;
  let isHovering = false;

  // Build indicators
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'indicator';
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.setAttribute('role', 'tab');
    btn.dataset.index = i;
    btn.addEventListener('click', () => goTo(i));
    indicatorsEl.appendChild(btn);
  }
  const indicatorButtons = Array.from(indicatorsEl.children);

  function update() {
    // translate slides container
    slidesEl.style.transform = `translateX(-${current * 100}%)`;

    // update aria-hidden on slides
    slideNodes.forEach((s, i) => {
      s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });

    // update indicators
    indicatorButtons.forEach((b, i) => {
      const selected = i === current;
      b.setAttribute('aria-selected', selected ? 'true' : 'false');
      b.tabIndex = selected ? 0 : -1;
    });
  }

  function next() {
    current = (current + 1) % total;
    update();
  }
  function prev() {
    current = (current - 1 + total) % total;
    update();
  }
  function goTo(index) {
    current = Math.max(0, Math.min(total - 1, index));
    update();
    restartTimer(); // reset auto-slide on manual navigation
  }

  // Auto slide timer
  function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
      if (!isHovering) next();
    }, intervalMs);
  }
  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function restartTimer() {
    stopTimer();
    startTimer();
  }

  // Attach event listeners
  nextBtn.addEventListener('click', () => { next(); restartTimer(); });
  prevBtn.addEventListener('click', () => { prev(); restartTimer(); });

  // Pause on hover
  carousel.addEventListener('mouseenter', () => { isHovering = true; });
  carousel.addEventListener('mouseleave', () => { isHovering = false; });

  // Keyboard support: left / right
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') { next(); restartTimer(); }
    if (ev.key === 'ArrowLeft')  { prev(); restartTimer(); }
  });

  // Optional: simple touch swipe (mobile)
  let touchStartX = 0;
  let touchEndX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    const threshold = 30; // swipe distance threshold
    if (Math.abs(diff) > threshold) {
      if (diff > 0) next();
      else prev();
      restartTimer();
    }
  });

  // Initialize
  update();
  startTimer();

  // Expose small API to window if needed
  window.simpleCarousel = { next, prev, goTo, startTimer, stopTimer };
})();
