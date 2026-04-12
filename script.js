const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('primaryNavigation');
const navLinks = navMenu.querySelectorAll('a');
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

function closeMobileMenu() {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
}

themeToggle.addEventListener('click', () => {
    setTheme(!pageShell.classList.contains('dark'));
});

menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(!expanded));
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 720) {
            closeMobileMenu();
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
        closeMobileMenu();
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
