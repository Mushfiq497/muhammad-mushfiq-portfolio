'use strict';

/* ===== DOM Elements ===== */
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');
const yearEl = document.getElementById('year');

/* ===== Theme Toggle ===== */
const THEME_KEY = 'profile-theme';

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ===== Mobile Navigation ===== */
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('show');
  navToggle.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
  });
});

/* ===== Header Scroll Effect ===== */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== Active Nav Link on Scroll ===== */
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavLink);

/* ===== Smooth Scroll for Anchor Links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===== Scroll Animations ===== */
const fadeElements = document.querySelectorAll(
  '.section__header, .about__text, .about__info, .skill-card, .project-card, .contact__info, .contact__form, .stat'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

/* ===== Animated Counters ===== */
function animateCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat__number');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ===== Skill Bar Animation ===== */
const skillBars = document.querySelectorAll('.skill-bar');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progress = entry.target.dataset.progress;
      const fill = entry.target.querySelector('.skill-bar__fill');
      fill.style.width = `${progress}%`;
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ===== Contact Form Validation ===== */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  field.classList.add('error');
  errorEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  field.classList.remove('error');
  errorEl.textContent = '';
}

function validateForm() {
  let isValid = true;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  clearError('name');
  clearError('email');
  clearError('message');

  if (!name) {
    showError('name', 'Please enter your name.');
    isValid = false;
  }

  if (!email) {
    showError('email', 'Please enter your email.');
    isValid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  if (!message) {
    showError('message', 'Please enter a message.');
    isValid = false;
  } else if (message.length < 10) {
    showError('message', 'Message must be at least 10 characters.');
    isValid = false;
  }

  return isValid;
}

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const successEl = document.getElementById('form-success');
  successEl.hidden = true;

  if (!validateForm()) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    successEl.hidden = false;
    contactForm.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    setTimeout(() => {
      successEl.hidden = true;
    }, 5000);
  }, 1200);
});

['name', 'email', 'message'].forEach(fieldId => {
  document.getElementById(fieldId).addEventListener('input', () => {
    clearError(fieldId);
  });
});

/* ===== Footer Year ===== */
yearEl.textContent = new Date().getFullYear();