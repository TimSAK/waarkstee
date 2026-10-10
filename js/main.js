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



// Kaart pas laden na klik (geen Google-requests bij paginalading)
(function () {
  var frame = document.querySelector('.map-frame[data-map-src]');
  if (!frame) return;
  var btn = frame.querySelector('.map-load');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var iframe = document.createElement('iframe');
    iframe.src = frame.getAttribute('data-map-src');
    iframe.title = 'Kaart Nieuweweg 16, Groningen';
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    frame.innerHTML = '';
    frame.appendChild(iframe);
  });
})();

// Wisselende aanloopzin boven de titel (tekstballon)
(function () {
  var pre = document.querySelector('.h1-pre');
  var el = pre && pre.querySelector('.h1-rotate');
  if (!el) return;
  var texts;
  try { texts = JSON.parse(el.getAttribute('data-rotate')); } catch (e) { return; }
  if (!texts || texts.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // per ballon een iets andere plek en helling
  var spots = [
    { x: 0,    r: -6 },
    { x: 1.6,  r: -3 },
    { x: 0.6,  r: -8 },
    { x: 2.4,  r: -5 },
    { x: 0.2,  r: -2 },
    { x: 1.2,  r: -7 }
  ];
  var i = 0, cur = el;
  setInterval(function () {
    i = (i + 1) % texts.length;
    var s = spots[i % spots.length];
    var next = document.createElement('span');
    next.className = 'h1-rotate moi is-in';
    next.setAttribute('aria-hidden', 'true');
    next.textContent = texts[i];
    next.style.left = s.x + 'em';
    next.style.setProperty('--tilt', s.r + 'deg');
    pre.appendChild(next);
    var prev = cur; cur = next;
    void next.offsetWidth;                     // reflow, zodat de fade-in echt animeert
    setTimeout(function () {
      next.classList.remove('is-in');          // nieuwe ballon verschijnt
      setTimeout(function () {                 // daarna pas de oude laten vervagen
        prev.classList.add('is-out');
        setTimeout(function () { if (prev.parentNode) prev.parentNode.removeChild(prev); }, 700);
      }, 450);
    }, 30);
  }, 10000);
})();

// Contactformulier: versturen zonder paginawissel (Web3Forms) + keuze vooraf invullen
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = form.querySelector('.cf-status');
  var button = form.querySelector('button[type="submit"]');

  function count(path) {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: path, title: path, event: true });
    }
  }

  // "Vaste plek aanvragen", "Flexplek aanvragen" enz. zetten de juiste keuze aan
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-interesse]');
    if (!link) return;
    var radio = form.querySelector('input[name="interesse"][value="' + link.getAttribute('data-interesse') + '"]');
    if (radio) radio.checked = true;
  });

  // Klikken op een mailadres ook tellen, zodat we zien of mensen contact zoeken
  document.addEventListener('click', function (e) {
    if (e.target.closest('a[href^="mailto:"]')) count('klik-mail');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    button.disabled = true;
    status.textContent = 'Bezig met versturen…';
    fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json().then(function (data) { return res.ok && data.success; }); })
      .then(function (ok) {
        if (!ok) throw new Error('niet verstuurd');
        form.classList.add('is-sent');
        status.textContent = 'Dank je! We hebben je bericht ontvangen en mailen je zo snel mogelijk terug.';
        count('aanvraag-verstuurd');
      })
      .catch(function () {
        status.innerHTML = 'Dat ging helaas mis. Mail ons direct op <a href="mailto:info@waarkstee.nl">info@waarkstee.nl</a>.';
        button.disabled = false;
      });
  });
})();
