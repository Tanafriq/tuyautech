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

  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    openItem.querySelector('.faq-answer').style.maxHeight = '0';
    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
  });

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
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
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

  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right:8px;"></i>Message envoyé !';
    btn.style.background = 'var(--success)';

    const successMsg = document.getElementById('form-success-msg');
    if (successMsg) successMsg.style.display = 'block';

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
        </svg>`;
      toggleBtn.setAttribute('title', 'Passer en mode clair');
      toggleBtn.setAttribute('aria-label', 'Passer en mode clair');
    } else {
      themeIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor"/>
        </svg>`;
      toggleBtn.setAttribute('title', 'Passer en mode sombre');
      toggleBtn.setAttribute('aria-label', 'Passer en mode sombre');
    }
  }

  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', function () {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    applyTheme(e.matches ? 'dark' : 'light');
  });
})();


/* ============================================
   MODALES LÉGALES (Mentions légales, CGV, Politique de confidentialité)
   ============================================ */
(function initLegalModals() {

  // ── Contenu des modales ──────────────────────────────────────────────────
  const legalContent = {
    mentions: {
      title: 'Mentions légales',
      icon: 'fa-solid fa-scale-balanced',
      body: `
        <h3>Éditeur du site</h3>
        <p><strong>Raison sociale :</strong> TUYAUTECH SARL<br>
        <strong>Siège social :</strong> 28 avenue Victor Hugo, 92220 Bagneux<br>
        <strong>Téléphone :</strong> +33 6 21 78 26 98<br>
        <strong>Email :</strong> contact@tuyautech.fr<br>
        <strong>Forme juridique :</strong> Société à responsabilité limitée (SARL)<br>
        <strong>Capital social :</strong> 1 000,00 € (fixe)<br>
        <strong>SIRET :</strong> 931 138 143 00017<br>
        <strong>TVA intracommunautaire :</strong> FR02 931 138 143</p>

        <h3>Directeur de la publication</h3>
        <p>[Nom du dirigeant], en qualité de gérant de TUYAUTECH SARL.</p>

        <h3>Hébergement</h3>
        <p><strong>Hébergeur :</strong> OVHcloud<br>
        <strong>Adresse :</strong> 2 Rue Kellermann, 59100 Roubaix, France<br>
        <strong>Site :</strong> https://www.ovhcloud.com</p>

        <h3>Propriété intellectuelle</h3>
        <p>L'ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété exclusive de TUYAUTECH SARL et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.</p>

        <h3>Responsabilité</h3>
        <p>TUYAUTECH SARL s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la complétude ou l'actualité des informations. L'utilisation des informations de ce site se fait sous la seule responsabilité de l'utilisateur.</p>

        <h3>Droit applicable</h3>
        <p>Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
      `
    },
    confidentialite: {
      title: 'Politique de confidentialité',
      icon: 'fa-solid fa-shield-halved',
      body: `
        <h3>1. Responsable du traitement</h3>
        <p>TUYAUTECH SARL, 28 avenue Victor Hugo, 92220 Bagneux - contact@tuyautech.fr</p>

        <h3>2. Données collectées</h3>
        <p>Lors de l'utilisation de notre formulaire de contact, nous collectons les données suivantes :</p>
        <ul>
          <li>Prénom et nom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone (facultatif)</li>
          <li>Type de projet et secteur d'activité</li>
          <li>Description du projet (message libre)</li>
        </ul>

        <h3>3. Finalité du traitement</h3>
        <p>Les données collectées sont utilisées exclusivement pour :</p>
        <ul>
          <li>Répondre à votre demande de devis ou de contact</li>
          <li>Assurer le suivi commercial de votre projet</li>
          <li>Améliorer nos services</li>
        </ul>

        <h3>4. Durée de conservation</h3>
        <p>Vos données sont conservées pendant une durée maximale de <strong>3 ans</strong> à compter de notre dernier contact, conformément aux recommandations de la CNIL.</p>

        <h3>5. Destinataires des données</h3>
        <p>Vos données sont destinées exclusivement aux équipes internes de TUYAUTECH SARL. Elles ne sont jamais vendues, cédées ou louées à des tiers.</p>

        <h3>6. Vos droits (RGPD)</h3>
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
          <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
          <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
          <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
        </ul>
        <p>Pour exercer ces droits, contactez-nous à : <strong>contact@tuyautech.fr</strong><br>
        Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> : <a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a></p>

        <h3>7. Cookies</h3>
        <p>Ce site n'utilise pas de cookies de traçage ou publicitaires. Des cookies techniques strictement nécessaires au bon fonctionnement du site peuvent être déposés.</p>

        <h3>8. Sécurité</h3>
        <p>TUYAUTECH SARL met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction.</p>
      `
    },
    cgv: {
      title: 'Conditions Générales de Vente',
      icon: 'fa-solid fa-file-contract',
      body: `
        <h3>1. Objet</h3>
        <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre TUYAUTECH SARL (ci-après "TUYAUTECH") et ses clients professionnels (ci-après "le Client") pour toute prestation de génie climatique, plomberie et travaux CVC.</p>

        <h3>2. Devis et commande</h3>
        <p>Toute prestation fait l'objet d'un devis écrit préalable, valable <strong>30 jours</strong> à compter de sa date d'émission. Le devis signé avec la mention "Bon pour accord" vaut acceptation des présentes CGV et engage les deux parties.</p>

        <h3>3. Prix et modalités de paiement</h3>
        <p>Les prix sont exprimés en euros HT, TVA en vigueur applicable. Sauf accord contraire :</p>
        <ul>
          <li><strong>30 %</strong> à la commande (acompte)</li>
          <li><strong>40 %</strong> à mi-chantier sur situation de travaux</li>
          <li><strong>30 %</strong> à la réception des travaux</li>
        </ul>
        <p>Tout retard de paiement entraîne des pénalités de retard au taux légal majoré de 3 points, exigibles sans mise en demeure préalable, ainsi qu'une indemnité forfaitaire de recouvrement de <strong>40 €</strong>.</p>

        <h3>4. Délais d'exécution</h3>
        <p>Les délais d'exécution sont indiqués dans le devis à titre indicatif. TUYAUTECH s'engage à respecter les délais convenus, sauf cas de force majeure, intempéries, retards d'approvisionnement indépendants de notre volonté ou modifications demandées par le Client.</p>

        <h3>5. Réception des travaux</h3>
        <p>À l'achèvement des travaux, une réception contradictoire est organisée. Les réserves éventuelles sont consignées par écrit dans le procès-verbal de réception. La levée des réserves donne lieu à la réception définitive.</p>

        <h3>6. Garanties</h3>
        <ul>
          <li><strong>Garantie de parfait achèvement :</strong> 1 an à compter de la réception (art. 1792-6 C. civ.)</li>
          <li><strong>Garantie biennale :</strong> 2 ans sur les équipements dissociables</li>
          <li><strong>Garantie décennale :</strong> 10 ans sur les ouvrages (art. 1792 C. civ.) - assurance souscrite auprès de notre assurance</li>
        </ul>

        <h3>7. Responsabilité</h3>
        <p>La responsabilité de TUYAUTECH est limitée au montant HT de la prestation concernée. TUYAUTECH ne saurait être tenu responsable des dommages indirects (pertes d'exploitation, manque à gagner).</p>

        <h3>8. Sous-traitance</h3>
        <p>TUYAUTECH se réserve le droit de sous-traiter tout ou partie des travaux, dans le respect de la loi n°75-1334 du 31 décembre 1975 relative à la sous-traitance.</p>

        <h3>9. Propriété des matériaux</h3>
        <p>Les matériaux et équipements fournis restent la propriété de TUYAUTECH jusqu'au paiement intégral du prix.</p>

        <h3>10. Résiliation</h3>
        <p>En cas d'inexécution par le Client de ses obligations, TUYAUTECH pourra suspendre ou résilier le contrat après mise en demeure restée sans effet sous 8 jours, sans préjudice de dommages et intérêts.</p>

        <h3>11. Litiges</h3>
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut, le <strong>Tribunal de Commerce de Nanterre</strong> sera seul compétent.</p>
      `
    }
  };

  // ── Créer et injecter la modale dans le DOM ──────────────────────────────
  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'legalModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'legalModalTitle');
    modal.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99998;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      padding: 24px 16px;
      overflow-y: auto;
      animation: legalFadeIn 0.25s ease;
    `;

    modal.innerHTML = `
      <style>
        @keyframes legalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes legalSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        #legalModalBox {
          background: var(--bg-secondary, #0b0e1a);
          border: 1px solid var(--border-accent, rgba(0,212,255,0.25));
          border-radius: 20px;
          max-width: 780px;
          margin: 0 auto;
          padding: 48px 48px 40px;
          position: relative;
          animation: legalSlideUp 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        #legalModalHeader {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.07));
        }
        #legalModalIcon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: rgba(0,212,255,0.1);
          border: 1px solid var(--border-accent, rgba(0,212,255,0.25));
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          color: var(--accent-cyan, #00d4ff);
          flex-shrink: 0;
        }
        #legalModalTitle {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary, #f0f4ff);
          margin: 0;
        }
        #legalModalClose {
          position: absolute;
          top: 20px; right: 20px;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1px solid var(--border, rgba(255,255,255,0.07));
          background: var(--bg-card, rgba(255,255,255,0.03));
          color: var(--text-secondary, #8892a4);
          font-size: 1rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        #legalModalClose:hover {
          border-color: var(--border-accent, rgba(0,212,255,0.25));
          color: var(--accent-cyan, #00d4ff);
          background: rgba(0,212,255,0.08);
        }
        #legalModalBody h3 {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--accent-cyan, #00d4ff);
          margin: 28px 0 10px;
        }
        #legalModalBody h3:first-child { margin-top: 0; }
        #legalModalBody p {
          font-size: 0.92rem;
          color: var(--text-secondary, #8892a4);
          line-height: 1.75;
          margin-bottom: 12px;
        }
        #legalModalBody ul {
          padding-left: 20px;
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        #legalModalBody li {
          font-size: 0.92rem;
          color: var(--text-secondary, #8892a4);
          line-height: 1.6;
        }
        #legalModalBody a {
          color: var(--accent-cyan, #00d4ff);
          text-decoration: underline;
        }
        #legalModalFooter {
          margin-top: 36px;
          padding-top: 20px;
          border-top: 1px solid var(--border, rgba(255,255,255,0.07));
          text-align: center;
        }
        #legalModalFooterBtn {
          padding: 12px 32px;
          border-radius: 10px;
          background: var(--gradient-main, linear-gradient(135deg,#1a8fff,#00d4ff));
          color: white;
          border: none;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: var(--shadow-glow-sm);
        }
        #legalModalFooterBtn:hover { transform: translateY(-2px); box-shadow: var(--shadow-glow-lg); }
        @media (max-width: 600px) {
          #legalModalBox { padding: 32px 20px 28px; }
          #legalModalTitle { font-size: 1.25rem; }
        }
      </style>
      <div id="legalModalBox">
        <button id="legalModalClose" aria-label="Fermer">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div id="legalModalHeader">
          <div id="legalModalIcon"><i id="legalModalIconInner"></i></div>
          <h2 id="legalModalTitle"></h2>
        </div>
        <div id="legalModalBody"></div>
        <div id="legalModalFooter">
          <button id="legalModalFooterBtn">
            <i class="fa-solid fa-check" style="margin-right:8px;"></i>J'ai compris
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  const modal = createModal();
  const modalBox = document.getElementById('legalModalBox');
  const modalTitle = document.getElementById('legalModalTitle');
  const modalIcon = document.getElementById('legalModalIconInner');
  const modalBody = document.getElementById('legalModalBody');
  const modalClose = document.getElementById('legalModalClose');
  const modalFooterBtn = document.getElementById('legalModalFooterBtn');

  // ── Ouvrir une modale ────────────────────────────────────────────────────
  function openLegalModal(key) {
    const data = legalContent[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalIcon.className = data.icon;
    modalBody.innerHTML = data.body;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;

    // Focus piégé sur le bouton fermer
    setTimeout(() => modalClose.focus(), 50);
  }

  // ── Fermer la modale ─────────────────────────────────────────────────────
  function closeLegalModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    // Retourner le focus au lien déclencheur
    if (modal._triggerEl) modal._triggerEl.focus();
  }

  modalClose.addEventListener('click', closeLegalModal);
  modalFooterBtn.addEventListener('click', closeLegalModal);

  // Clic sur le fond (hors boîte)
  modal.addEventListener('click', (e) => {
    if (!modalBox.contains(e.target)) closeLegalModal();
  });

  // Fermer avec Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') closeLegalModal();
  });

  // ── Brancher les liens du footer ─────────────────────────────────────────
  // Cherche les liens par leur texte exact dans le footer-bottom
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  document.querySelectorAll('.footer-bottom a').forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    let key = null;

    if (text.includes('mentions')) key = 'mentions';
    else if (text.includes('confidentialit')) key = 'confidentialite';
    else if (text.includes('cgv')) key = 'cgv';

    if (key) {
      link.setAttribute('href', '#');
      link.setAttribute('role', 'button');
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        modal._triggerEl = link;
        openLegalModal(key);
      });
    }
  });

  // ── API publique (optionnel, pour appel externe) ─────────────────────────
  window.openLegalModal = openLegalModal;

})();

/* ============================================
   GESTION DES COOKIES (CNIL / RGPD)
   ============================================ */
(function initCookieBanner() {

  const COOKIE_KEY = 'tuyautech_cookie_consent';
  const COOKIE_EXPIRY_DAYS = 180; // 6 mois (recommandation CNIL)

  // ── Utilitaires cookies ──────────────────────────────────────────────────
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function getCookie(name) {
    return document.cookie.split('; ').reduce((acc, part) => {
      const [k, v] = part.split('=');
      return k === name ? decodeURIComponent(v) : acc;
    }, null);
  }

  // ── Vérifier si déjà consenti ────────────────────────────────────────────
  const existing = getCookie(COOKIE_KEY);
  if (existing) return; // déjà répondu, ne rien afficher

  // ── Injecter le CSS ──────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #cookieBanner {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 99997;
      background: var(--bg-secondary, #0b0e1a);
      border-top: 1px solid var(--border-accent, rgba(0,212,255,0.25));
      padding: 20px 5%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
      box-shadow: 0 -4px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,212,255,0.05);
      animation: cookieSlideUp 0.4s cubic-bezier(0.23,1,0.32,1);
      transform-origin: bottom;
    }
    @keyframes cookieSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #cookieBanner.hiding {
      animation: cookieSlideDown 0.35s cubic-bezier(0.23,1,0.32,1) forwards;
    }
    @keyframes cookieSlideDown {
      from { transform: translateY(0);    opacity: 1; }
      to   { transform: translateY(100%); opacity: 0; }
    }
    #cookieBannerText {
      flex: 1;
      min-width: 260px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }
    #cookieBannerIcon {
      width: 40px; height: 40px; flex-shrink: 0;
      border-radius: 12px;
      background: rgba(0,212,255,0.08);
      border: 1px solid var(--border-accent, rgba(0,212,255,0.25));
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
      color: var(--accent-cyan, #00d4ff);
      margin-top: 2px;
    }
    #cookieBannerText p {
      margin: 0;
      font-size: 0.88rem;
      color: var(--text-secondary, #8892a4);
      line-height: 1.6;
    }
    #cookieBannerText p strong {
      color: var(--text-primary, #f0f4ff);
      font-size: 0.95rem;
      display: block;
      margin-bottom: 4px;
    }
    #cookieBannerText a {
      color: var(--accent-cyan, #00d4ff);
      text-decoration: underline;
      font-size: 0.85rem;
    }
    #cookieBannerActions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    .cookie-btn-settings {
      padding: 9px 18px;
      border-radius: 8px;
      border: 1px solid var(--border, rgba(255,255,255,0.07));
      background: transparent;
      color: var(--text-secondary, #8892a4);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      white-space: nowrap;
    }
    .cookie-btn-settings:hover {
      border-color: var(--border-accent, rgba(0,212,255,0.25));
      color: var(--text-primary, #f0f4ff);
    }
    .cookie-btn-refuse {
      padding: 9px 18px;
      border-radius: 8px;
      border: 1px solid var(--border-accent, rgba(0,212,255,0.25));
      background: transparent;
      color: var(--accent-cyan, #00d4ff);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      white-space: nowrap;
    }
    .cookie-btn-refuse:hover {
      background: rgba(0,212,255,0.06);
    }
    .cookie-btn-accept {
      padding: 9px 22px;
      border-radius: 8px;
      background: var(--gradient-main, linear-gradient(135deg,#1a8fff,#00d4ff));
      color: white;
      border: none;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      box-shadow: var(--shadow-glow-sm);
      white-space: nowrap;
    }
    .cookie-btn-accept:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-glow-md);
    }

    /* ── Modale Paramètres ── */
    #cookieSettingsModal {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      padding: 24px 16px;
      overflow-y: auto;
      animation: legalFadeIn 0.25s ease;
    }
    #cookieSettingsBox {
      background: var(--bg-secondary, #0b0e1a);
      border: 1px solid var(--border-accent, rgba(0,212,255,0.25));
      border-radius: 20px;
      max-width: 560px;
      margin: 0 auto;
      padding: 44px 44px 36px;
      position: relative;
      animation: legalSlideUp 0.3s cubic-bezier(0.23,1,0.32,1);
    }
    #cookieSettingsClose {
      position: absolute;
      top: 18px; right: 18px;
      width: 36px; height: 36px;
      border-radius: 10px;
      border: 1px solid var(--border, rgba(255,255,255,0.07));
      background: var(--bg-card, rgba(255,255,255,0.03));
      color: var(--text-secondary, #8892a4);
      font-size: 0.95rem;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    #cookieSettingsClose:hover {
      border-color: var(--border-accent);
      color: var(--accent-cyan, #00d4ff);
    }
    #cookieSettingsBox h2 {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text-primary, #f0f4ff);
    }
    #cookieSettingsBox > p {
      font-size: 0.88rem;
      color: var(--text-secondary, #8892a4);
      line-height: 1.65;
      margin-bottom: 28px;
    }
    .cookie-category {
      background: var(--bg-card, rgba(255,255,255,0.03));
      border: 1px solid var(--border, rgba(255,255,255,0.07));
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 12px;
      transition: border-color 0.2s;
    }
    .cookie-category:hover { border-color: var(--border-accent); }
    .cookie-category-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 6px;
    }
    .cookie-category-title {
      font-weight: 700;
      font-size: 0.92rem;
      color: var(--text-primary, #f0f4ff);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cookie-category-title i { color: var(--accent-cyan, #00d4ff); font-size: 0.85rem; }
    .cookie-required-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent-cyan, #00d4ff);
      background: rgba(0,212,255,0.08);
      border: 1px solid var(--border-accent, rgba(0,212,255,0.25));
      border-radius: 100px;
      padding: 2px 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .cookie-category p {
      font-size: 0.83rem;
      color: var(--text-secondary, #8892a4);
      line-height: 1.55;
      margin: 0;
    }

    /* Toggle switch */
    .cookie-toggle {
      position: relative;
      width: 42px; height: 24px;
      flex-shrink: 0;
    }
    .cookie-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
    .cookie-toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: rgba(255,255,255,0.1);
      border-radius: 100px;
      transition: 0.25s;
      border: 1px solid var(--border, rgba(255,255,255,0.07));
    }
    .cookie-toggle-slider:before {
      content: '';
      position: absolute;
      width: 16px; height: 16px;
      left: 3px; top: 3px;
      border-radius: 50%;
      background: var(--text-muted, #4a5568);
      transition: 0.25s cubic-bezier(0.23,1,0.32,1);
    }
    .cookie-toggle input:checked + .cookie-toggle-slider {
      background: var(--gradient-main, linear-gradient(135deg,#1a8fff,#00d4ff));
      border-color: transparent;
    }
    .cookie-toggle input:checked + .cookie-toggle-slider:before {
      transform: translateX(18px);
      background: white;
    }
    .cookie-toggle input:disabled + .cookie-toggle-slider { cursor: not-allowed; opacity: 0.6; }

    .cookie-settings-actions {
      display: flex;
      gap: 10px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    .cookie-settings-actions button {
      flex: 1 1 0;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 12px;
      padding-right: 12px;
    }

    @media (max-width: 400px) {
      .cookie-settings-actions {
        flex-direction: column;
      }
      .cookie-settings-actions button {
        width: 100%;
        white-space: normal;
        text-align: center;
      }
    }

    @media (max-width: 600px) {
      #cookieBanner { padding: 16px 4%; }
      #cookieBannerActions { width: 100%; justify-content: flex-end; }
      #cookieSettingsBox { padding: 32px 20px 28px; }
    }
  `;
  document.head.appendChild(style);

  // ── Créer le bandeau ─────────────────────────────────────────────────────
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Gestion des cookies');
  banner.innerHTML = `
    <div id="cookieBannerText">
      <div id="cookieBannerIcon"><i class="fa-solid fa-cookie-bite"></i></div>
      <p>
        <strong>Ce site utilise des cookies</strong>
        Nous utilisons uniquement des cookies techniques nécessaires au bon fonctionnement du site (thème, préférences). Aucun cookie publicitaire ou de traçage.
        <br><a href="#" id="cookiePolicyLink">En savoir plus</a>
      </p>
    </div>
    <div id="cookieBannerActions">
      <button class="cookie-btn-settings" id="cookieBtnSettings">
        <i class="fa-solid fa-sliders" style="margin-right:6px;"></i>Paramétrer
      </button>
      <button class="cookie-btn-refuse" id="cookieBtnRefuse">
        Refuser
      </button>
      <button class="cookie-btn-accept" id="cookieBtnAccept">
        <i class="fa-solid fa-check" style="margin-right:6px;"></i>Tout accepter
      </button>
    </div>
  `;
  document.body.appendChild(banner);

  // ── Créer la modale Paramètres ───────────────────────────────────────────
  const settingsModal = document.createElement('div');
  settingsModal.id = 'cookieSettingsModal';
  settingsModal.setAttribute('role', 'dialog');
  settingsModal.setAttribute('aria-modal', 'true');
  settingsModal.setAttribute('aria-labelledby', 'cookieSettingsTitle');
  settingsModal.innerHTML = `
    <div id="cookieSettingsBox">
      <button id="cookieSettingsClose" aria-label="Fermer">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <h2 id="cookieSettingsTitle">
        <i class="fa-solid fa-sliders" style="color:var(--accent-cyan);margin-right:10px;"></i>Paramètres des cookies
      </h2>
      <p>Choisissez les catégories de cookies que vous autorisez. Votre choix est sauvegardé pendant 6 mois.</p>

      <!-- Catégorie 1 : Nécessaires (toujours actifs) -->
      <div class="cookie-category">
        <div class="cookie-category-header">
          <span class="cookie-category-title">
            <i class="fa-solid fa-shield-halved"></i>Cookies nécessaires
          </span>
          <span class="cookie-required-badge">Toujours actifs</span>
        </div>
        <p>Indispensables au fonctionnement du site : mémorisation du thème (clair/sombre), préférences d'affichage, sécurité de session. Ils ne peuvent pas être désactivés.</p>
      </div>

      <!-- Catégorie 2 : Analytiques -->
      <div class="cookie-category">
        <div class="cookie-category-header">
          <span class="cookie-category-title">
            <i class="fa-solid fa-chart-simple"></i>Cookies analytiques
          </span>
          <label class="cookie-toggle">
            <input type="checkbox" id="toggleAnalytics">
            <span class="cookie-toggle-slider"></span>
          </label>
        </div>
        <p>Permettent de mesurer l'audience et d'analyser le comportement des visiteurs pour améliorer le site (ex. : pages visitées, durée de visite). Aucun outil tiers n'est actuellement activé.</p>
      </div>

      <!-- Catégorie 3 : Marketing -->
      <div class="cookie-category">
        <div class="cookie-category-header">
          <span class="cookie-category-title">
            <i class="fa-solid fa-bullhorn"></i>Cookies marketing
          </span>
          <label class="cookie-toggle">
            <input type="checkbox" id="toggleMarketing">
            <span class="cookie-toggle-slider"></span>
          </label>
        </div>
        <p>Utilisés pour afficher des publicités personnalisées. TUYAUTECH n'utilise actuellement aucun cookie de ce type.</p>
      </div>

      <div class="cookie-settings-actions">
        <button class="cookie-btn-refuse" id="cookieSettingsRefuse">Tout refuser</button>
        <button class="cookie-btn-accept" id="cookieSettingsSave">
          <i class="fa-solid fa-check" style="margin-right:6px;"></i>Enregistrer mes choix
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(settingsModal);

  // ── Logique fermeture / sauvegarde ───────────────────────────────────────
  function hideBanner() {
    banner.classList.add('hiding');
    banner.addEventListener('animationend', () => banner.remove(), { once: true });
  }

  function saveConsent(analytics, marketing) {
    const value = JSON.stringify({
      necessary: true,
      analytics: !!analytics,
      marketing: !!marketing,
      date: new Date().toISOString()
    });
    setCookie(COOKIE_KEY, value, COOKIE_EXPIRY_DAYS);
    hideBanner();
    closeSettings();

    // Ici, déclencher les scripts conditionnels (ex: GA4 si analytics=true)
    if (analytics) applyAnalytics();
    if (marketing) applyMarketing();
  }

  function applyAnalytics() {
    // Activer Google Analytics ou autre outil analytique ici si besoin
    // Ex: gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  function applyMarketing() {
    // Activer pixels marketing ici si besoin
    // Ex: fbq('consent', 'grant');
  }

  function openSettings() {
    // Pré-remplir les toggles si un consentement partiel existe
    try {
      const saved = JSON.parse(getCookie(COOKIE_KEY) || '{}');
      document.getElementById('toggleAnalytics').checked = !!saved.analytics;
      document.getElementById('toggleMarketing').checked = !!saved.marketing;
    } catch { /* ignore */ }
    settingsModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('cookieSettingsClose').focus(), 50);
  }

  function closeSettings() {
    settingsModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ── Événements du bandeau ────────────────────────────────────────────────
  document.getElementById('cookieBtnAccept').addEventListener('click', () => {
    saveConsent(true, true);
  });

  document.getElementById('cookieBtnRefuse').addEventListener('click', () => {
    saveConsent(false, false);
  });

  document.getElementById('cookieBtnSettings').addEventListener('click', () => {
    openSettings();
  });

  // Lien "En savoir plus" → ouvre la politique de confidentialité
  document.getElementById('cookiePolicyLink').addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof window.openLegalModal === 'function') {
      window.openLegalModal('confidentialite');
    }
  });

  // ── Événements de la modale Paramètres ──────────────────────────────────
  document.getElementById('cookieSettingsClose').addEventListener('click', closeSettings);
  document.getElementById('cookieSettingsRefuse').addEventListener('click', () => saveConsent(false, false));
  document.getElementById('cookieSettingsSave').addEventListener('click', () => {
    const analytics = document.getElementById('toggleAnalytics').checked;
    const marketing = document.getElementById('toggleMarketing').checked;
    saveConsent(analytics, marketing);
  });

  // Clic fond modale
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettings();
  });

  // Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsModal.style.display === 'block') closeSettings();
  });

  // ── Bouton de réouverture dans le footer (optionnel) ─────────────────────
  // Permet à l'utilisateur de revoir ses préférences à tout moment
  // Ajouter dans le HTML footer : <button id="cookieReopenBtn">Gérer les cookies</button>
  const reopenBtn = document.getElementById('cookieReopenBtn');
  if (reopenBtn) {
    reopenBtn.addEventListener('click', () => {
      openSettings();
    });
  }

})();