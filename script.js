/* ============================================
     PAGE LOADER
     ============================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 300);
  }
});

/* ============================================
   NAVBAR SCROLL
   ============================================ */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 50);
  backToTop.classList.toggle('visible', scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   MENU MOBILE
   ============================================ */
function toggleMenu() {
  const btn = document.querySelector('.nav-hamburger');
  const menu = document.getElementById('mobileMenu');
  const isOpen = btn.classList.toggle('open');
  menu.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen.toString());
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Fermer menu mobile au clic sur un lien
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => {
    const btn = document.querySelector('.nav-hamburger');
    const menu = document.getElementById('mobileMenu');
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ============================================
   EXPERTISE TABS
   ============================================ */
function switchTab(btn, tabId) {
  document.querySelectorAll('.expertise-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.expertise-content').forEach(c => {
    c.classList.remove('active');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');

  // Fermer tous
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    openItem.querySelector('.faq-answer').style.maxHeight = '0';
    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
  });

  // Ouvrir si était fermé
  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }
}

function handleFaqKeydown(e, btn) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleFaq(btn);
  }
}

/* ============================================
   PARTICULES CANVAS
   ============================================ */
(function initParticles() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (1 - this.life / this.maxLife);
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  init();
  animate();
})();

/* ============================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ============================================ */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-up-fast').forEach(el => {
  fadeObserver.observe(el);
});

/* ============================================
   FORMULAIRE - VALIDATION
   ============================================ */
function showError(id, msg) {
  const input = document.getElementById(id);
  if (!input) return;
  const group = input.parentElement;
  group.classList.add('error');
  group.classList.remove('success');
  const errEl = document.getElementById(id + '-error');
  if (errEl) errEl.textContent = msg;
}

function showSuccess(id) {
  const input = document.getElementById(id);
  if (!input) return;
  const group = input.parentElement;
  group.classList.remove('error');
  group.classList.add('success');
  const errEl = document.getElementById(id + '-error');
  if (errEl) errEl.textContent = '';
}

function clearError(id) {
  const input = document.getElementById(id);
  if (!input) return;
  const group = input.parentElement;
  group.classList.remove('error', 'success');
  const errEl = document.getElementById(id + '-error');
  if (errEl) errEl.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return phone === '' || /^[+\d\s\-().]{7,20}$/.test(phone);
}

['firstname', 'lastname', 'email', 'phone', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur', () => {
    const val = el.value.trim();
    if (id === 'email') {
      if (!val) showError('email', 'L\'adresse email est requise.');
      else if (!validateEmail(val)) showError('email', 'Format d\'email invalide.');
      else showSuccess('email');
    } else if (id === 'phone') {
      if (val && !validatePhone(val)) showError('phone', 'Numéro de téléphone invalide.');
      else if (val) showSuccess('phone');
      else clearError('phone');
    } else if (id === 'message') {
      if (!val) showError('message', 'Veuillez décrire votre projet.');
      else if (val.length < 20) showError('message', 'Description trop courte (20 caractères min).');
      else showSuccess('message');
    } else {
      if (!val) showError(id, 'Ce champ est requis.');
      else showSuccess(id);
    }
  });

  el.addEventListener('input', () => clearError(id));
});

// Validation du select projectType au changement
document.getElementById('projectType').addEventListener('change', function () {
  if (this.value) showSuccess('projectType');
  else showError('projectType', 'Veuillez sélectionner un type de projet.');
});

function validateForm() {
  let valid = true;

  const firstname = document.getElementById('firstname').value.trim();
  if (!firstname) { showError('firstname', 'Le prénom est requis.'); valid = false; }
  else showSuccess('firstname');

  const lastname = document.getElementById('lastname').value.trim();
  if (!lastname) { showError('lastname', 'Le nom est requis.'); valid = false; }
  else showSuccess('lastname');

  const email = document.getElementById('email').value.trim();
  if (!email) { showError('email', 'L\'adresse email est requise.'); valid = false; }
  else if (!validateEmail(email)) { showError('email', 'Format d\'email invalide.'); valid = false; }
  else showSuccess('email');

  const phone = document.getElementById('phone').value.trim();
  if (phone && !validatePhone(phone)) { showError('phone', 'Numéro de téléphone invalide.'); valid = false; }
  else if (phone) showSuccess('phone');

  const projectType = document.getElementById('projectType').value;
  if (!projectType) { showError('projectType', 'Veuillez sélectionner un type de projet.'); valid = false; }
  else showSuccess('projectType');

  const message = document.getElementById('message').value.trim();
  if (!message) { showError('message', 'Veuillez décrire votre projet.'); valid = false; }
  else if (message.length < 20) { showError('message', 'Description trop courte (20 caractères min).'); valid = false; }
  else showSuccess('message');

  return valid;
}

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validateForm()) {
    const firstError = this.querySelector('.form-group.error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const btn = document.getElementById('formSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i>Envoi en cours...';

  // Simulation envoi (remplacer par appel API réel)
  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right:8px;"></i>Message envoyé !';
    btn.style.background = 'var(--success)';

    const successMsg = document.getElementById('form-success-msg');
    if (successMsg) successMsg.style.display = 'block';

    // Reset après 5 secondes
    setTimeout(() => {
      document.getElementById('contactForm').reset();
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error', 'success'));
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i>Envoyer ma demande';
      btn.style.background = '';
      if (successMsg) successMsg.style.display = 'none';
    }, 5000);
  }, 1500);
});


/* ============================================
   TOGGLE THÈME CLAIR / SOMBRE
   ============================================ */
(function () {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentTheme = prefersDark ? 'dark' : 'light';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    currentTheme = theme;

    if (theme === 'dark') {
      themeIcon.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="4" fill="currentColor"/>
                    <path d="M12 2V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M12 20V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M22 12H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M4 12H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M19.0711 4.92896L17.5 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M6.5 17.5L4.92896 19.0711" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M19.0711 19.0711L17.5 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M6.5 6.5L4.92896 4.92896" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            `;
      toggleBtn.setAttribute('title', 'Passer en mode clair');
      toggleBtn.setAttribute('aria-label', 'Passer en mode clair');
    } else {
      themeIcon.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor"/>
                </svg>
            `;
      toggleBtn.setAttribute('title', 'Passer en mode sombre');
      toggleBtn.setAttribute('aria-label', 'Passer en mode sombre');
    }
  }

  // Appliquer le thème initial
  applyTheme(currentTheme);

  // Toggle au clic
  toggleBtn.addEventListener('click', function () {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // Écouter les changements système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    applyTheme(e.matches ? 'dark' : 'light');
  });
})();