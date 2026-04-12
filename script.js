const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const pageShell = document.documentElement;

function setTheme(darkMode) {
  if (darkMode) {
    pageShell.classList.add('dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('portfolio-theme', 'dark');
  } else {
    pageShell.classList.remove('dark');
    themeToggle.textContent = '🌙';
    localStorage.setItem('portfolio-theme', 'light');
  }
}

function loadTheme() {
  const storedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(storedTheme === 'dark' || (storedTheme === null && prefersDark));
}

themeToggle.addEventListener('click', () => {
  setTheme(!pageShell.classList.contains('dark'));
});

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) {
    navMenu.classList.remove('open');
  }
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

loadTheme();
