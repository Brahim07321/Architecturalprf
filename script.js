/**
 * Architect Portfolio — script.js
 * Karim Raouf Studio
 *
 * Features:
 *  1. Sticky header with scroll-triggered glass effect
 *  2. Active nav link highlighting (IntersectionObserver)
 *  3. Animated hamburger + full-screen mobile menu
 *  4. Smooth scroll for all anchor links
 *  5. Scroll-triggered fade/slide-up animations
 *  6. Contact form with validation + success state
 */

'use strict';

/* ── DOM REFERENCES ───────────────────────────────────────── */
const header      = document.getElementById('site-header');
const burger      = document.getElementById('burger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const overlay     = document.getElementById('mobile-overlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks    = document.querySelectorAll('.nav__links a');
const sections    = document.querySelectorAll('section[id]');
const animEls     = document.querySelectorAll('.animate-up');
const form        = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

/* ── 1. STICKY HEADER ─────────────────────────────────────── */
function updateHeader() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader(); // run on load

/* ── 2. ACTIVE NAV LINK ───────────────────────────────────── */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  }
);

sections.forEach(section => sectionObserver.observe(section));

/* ── 3. MOBILE MENU ───────────────────────────────────────── */
function openMenu() {
  mobileMenu.classList.add('is-open');
  overlay.classList.add('is-visible');
  burger.classList.add('is-open');
  burger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Trap focus inside menu
  setTimeout(() => mobileClose.focus(), 50);
}

function closeMenu() {
  mobileMenu.classList.remove('is-open');
  overlay.classList.remove('is-visible');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  burger.focus();
}

burger.addEventListener('click', () => {
  if (mobileMenu.classList.contains('is-open')) {
    closeMenu();
  } else {
    openMenu();
  }
});
mobileClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
    closeMenu();
  }
});

/* ── 4. SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = header.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
});

/* ── 5. SCROLL ANIMATIONS ─────────────────────────────────── */
// Stagger sibling animate-up elements within each parent
function applyStagger() {
  const parents = new Set();
  animEls.forEach(el => parents.add(el.parentElement));

  parents.forEach(parent => {
    const children = [...parent.querySelectorAll('.animate-up')];
    children.forEach((child, i) => {
      // Only stagger if there's no explicit CSS delay already set
      if (!child.style.transitionDelay) {
        child.style.transitionDelay = `${i * 0.08}s`;
      }
    });
  });
}

applyStagger();

const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animObserver.unobserve(entry.target); // animate once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  }
);

animEls.forEach(el => animObserver.observe(el));

/* ── 6. CONTACT FORM ──────────────────────────────────────── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(field, message) {
  field.style.borderBottomColor = '#e05252';
  let err = field.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'font-size:11px;color:#e05252;letter-spacing:0.06em;margin-top:4px;display:block;';
    field.parentElement.appendChild(err);
  }
  err.textContent = message;
}

function clearFieldError(field) {
  field.style.borderBottomColor = '';
  const err = field.parentElement.querySelector('.field-error');
  if (err) err.remove();
}

if (form) {
  // Live validation on blur
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      if (field.required && !field.value.trim()) {
        setFieldError(field, 'This field is required.');
      } else if (field.type === 'email' && field.value && !validateEmail(field.value)) {
        setFieldError(field, 'Please enter a valid email address.');
      } else {
        clearFieldError(field);
      }
    });

    field.addEventListener('input', () => {
      if (field.style.borderBottomColor === 'rgb(224, 82, 82)') {
        clearFieldError(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const message = form.querySelector('#message');
    let valid = true;

    // Clear all errors first
    [name, email, message].forEach(clearFieldError);

    if (!name.value.trim()) {
      setFieldError(name, 'Please enter your name.');
      valid = false;
    }

    if (!email.value.trim()) {
      setFieldError(email, 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email.value)) {
      setFieldError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (!message.value.trim()) {
      setFieldError(message, 'Please write a message.');
      valid = false;
    }

    if (!valid) return;

    // Simulate async submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      formSuccess.classList.add('is-visible');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        formSuccess.classList.remove('is-visible');
      }, 6000);
    }, 1200);
  });
}

/* ── PROJECT CARD KEYBOARD INTERACTION ───────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

/* ── HERO PARALLAX (subtle) ──────────────────────────────── */
const heroShapes = document.querySelectorAll('.hero__shape');

function heroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scrollY = window.scrollY;
  heroShapes.forEach((shape, i) => {
    const speed = 0.08 + i * 0.04;
    shape.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

window.addEventListener('scroll', heroParallax, { passive: true });

/* ── INIT COMPLETE ────────────────────────────────────────── */
console.log('%cKarim Raouf Studio — Portfolio loaded.', 'color:#B8956A;font-family:monospace;font-size:12px;');
