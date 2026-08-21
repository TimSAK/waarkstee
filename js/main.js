(function () {
  'use strict';

  // Jaartal in de footer
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobiel menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    menu.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Sluit het menu na een klik op een link of bij Escape
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
})();

// Hero-diavoorstelling: wisselt elke 5 s tussen de foto's
(function () {
  'use strict';

  var root = document.querySelector('.hero-slides');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('img'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.hero-dots button'));
  if (slides.length < 2) return;

  var INTERVAL = 5000;
  var FADE = 900; // moet overeenkomen met de transition in de CSS
  var current = 0;
  var timer = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function show(index) {
    index = (index + slides.length) % slides.length;
    if (index === current) return;

    var prev = slides[current];
    var next = slides[index];

    prev.classList.remove('is-active');
    prev.classList.add('is-prev');
    next.classList.add('is-active');
    window.setTimeout(function () { prev.classList.remove('is-prev'); }, FADE);

    dots.forEach(function (dot, i) {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    current = index;
  }

  function start() {
    stop();
    if (reduceMotion.matches || document.hidden) return;
    timer = window.setInterval(function () { show(current + 1); }, INTERVAL);
  }
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { show(i); start(); });
  });

  // Pauzeer bij hover/focus en als het tabblad niet zichtbaar is
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', start);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', start);

  start();
})();
