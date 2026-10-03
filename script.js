/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function animateRing(){
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
})();
document.querySelectorAll('a, button, .service-card, .port-item, .price-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('grow'));
  el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
});

/* ============================================================
   HERO MOUSE PARALLAX
   ============================================================ */
const heroVisual = document.getElementById('heroVisual');
if (heroVisual && window.matchMedia('(hover: hover)').matches){
  const parallaxLayers = heroVisual.querySelectorAll('.parallax-layer');
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    parallaxLayers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth) || 15;
      layer.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
    });
  });
  heroVisual.addEventListener('mouseleave', () => {
    parallaxLayers.forEach(layer => { layer.style.transform = 'translate(0,0)'; });
  });
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
document.querySelectorAll('.btn.magnetic').forEach(btn => {
  if (!window.matchMedia('(hover: hover)').matches) return;
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.5;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});

/* ============================================================
   NAVBAR SCROLL STATE
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 500);
});

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const mobileClose = document.getElementById('mobileClose');

function openMobileMenu(){
  hamburger.classList.add('active');
  mobileMenu.classList.add('open');
  menuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu(){
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
function toggleMenu(){
  mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
}
hamburger.addEventListener('click', toggleMenu);
mobileClose.addEventListener('click', closeMobileMenu);
menuOverlay.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });

/* ============================================================
   DARK MODE TOGGLE
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
function setTheme(theme){
  root.setAttribute('data-theme', theme);
  themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}
setTheme('light');
themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   BUTTON RIPPLE EFFECT
   ============================================================ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let start = 0;
      const duration = 1600;
      const startTime = performance.now();
      function tick(now){
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + (progress === 1 ? '+' : '');
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ============================================================
   PROCESS ANIMATED CONNECTING LINE
   ============================================================ */
const processTrack = document.getElementById('processTrack');
const processLine = document.getElementById('processLine');
if (processTrack && processLine){
  function updateProcessLine(){
    const rect = processTrack.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    // progress: how far the viewport center has moved through the track
    const start = vh * 0.8;
    const raw = (start - rect.top) / (total + start - vh * 0.2);
    const progress = Math.min(Math.max(raw, 0), 1);
    processLine.style.height = (progress * 100) + '%';
  }
  window.addEventListener('scroll', updateProcessLine, { passive: true });
  window.addEventListener('resize', updateProcessLine);
  updateProcessLine();
}

/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const portItems = document.querySelectorAll('.port-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portItems.forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hidden', !show);
    });
  });
});



/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (item.classList.contains('active')) a.style.maxHeight = a.scrollHeight + 'px';
  q.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isActive){
      item.classList.add('active');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

/* ============================================================
   CONTACT FORM — EmailJS Integration
   ============================================================
   SETUP REQUIRED: This form uses EmailJS (https://www.emailjs.com)
   to send submissions straight to your Gmail inbox — no backend needed.

   To activate it:
   1. Create a free account at https://www.emailjs.com
   2. Add an Email Service (connect your Gmail) → copy its Service ID
   3. Create an Email Template with variables: {{name}}, {{email}},
      {{phone}}, {{company}}, {{service}}, {{budget}}, {{message}}
      → copy its Template ID
   4. Go to Account → General → copy your Public Key
   5. Paste all three values into the constants below.

   Until these are filled in, the form will show a friendly error
   message instead of silently failing.
   ============================================================ */
const EMAILJS_PUBLIC_KEY  = 'sJ5FVeUB7cFSNDEkW';
const EMAILJS_SERVICE_ID  = 'service_7q9rm8h';
const EMAILJS_TEMPLATE_ID = 'template_jfe6fbd';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'){
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const contactForm   = document.getElementById('contactForm');
const formStatus    = document.getElementById('formStatus');
const formSubmitBtn = document.getElementById('formSubmitBtn');

function setFieldError(groupId, isError){
  const group = document.getElementById(groupId);
  if (group) group.classList.toggle('error', isError);
}

function showFormStatus(type, message){
  formStatus.className = 'form-status show ' + type;
  formStatus.innerHTML = (type === 'success'
    ? '<i class="fa-solid fa-circle-check"></i> '
    : '<i class="fa-solid fa-triangle-exclamation"></i> ') + message;
}
function hideFormStatus(){
  formStatus.className = 'form-status';
  formStatus.innerHTML = '';
}

function validateContactForm(){
  let valid = true;
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  setFieldError('fnameGroup', false);
  setFieldError('femailGroup', false);
  setFieldError('fmessageGroup', false);

  if (name.length < 2){ setFieldError('fnameGroup', true); valid = false; }
  if (!emailPattern.test(email)){ setFieldError('femailGroup', true); valid = false; }
  if (message.length < 10){ setFieldError('fmessageGroup', true); valid = false; }

  return valid;
}

if (contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    hideFormStatus();

    if (!validateContactForm()){
      showFormStatus('error', 'Please fix the highlighted fields and try again.');
      return;
    }

    if (typeof emailjs === 'undefined'){
      showFormStatus('error', 'Could not load the email service. Please try again or message us on WhatsApp.');
      return;
    }
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'){
      showFormStatus('error', 'Contact form isn\'t fully configured yet — please reach out via WhatsApp or email in the meantime.');
      return;
    }

    const templateParams = {
      name: document.getElementById('fname').value.trim(),
      email: document.getElementById('femail').value.trim(),
      phone: document.getElementById('fphone').value.trim() || 'Not provided',
      company: document.getElementById('fcompany').value.trim() || 'Not provided',
      service: document.getElementById('fservice').value,
      budget: document.getElementById('fbudget').value,
      message: document.getElementById('fmessage').value.trim()
    };

    formSubmitBtn.classList.add('is-loading');

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        formSubmitBtn.classList.remove('is-loading');
        showFormStatus('success', 'Message sent! Our team will get back to you within 24 hours.');
        contactForm.reset();
      })
      .catch((err) => {
        formSubmitBtn.classList.remove('is-loading');
        showFormStatus('error', 'Something went wrong sending your message. Please try WhatsApp instead.');
        console.error('EmailJS error:', err);
      });
  });

  // clear error state as the visitor starts fixing a field
  ['fname','femail','fmessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => setFieldError(id + 'Group', false));
  });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   FOOTER YEAR
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();