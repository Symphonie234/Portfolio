const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('primaryNavigation');
const navLinks = navMenu.querySelectorAll('a');
const sections = document.querySelectorAll('section[id]');
const topbar = document.querySelector('.topbar');
const rootElement = document.documentElement;

function setTheme(darkMode) {
    if (darkMode) {
        rootElement.classList.add('dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('portfolio-theme', 'dark');
    } else {
        rootElement.classList.remove('dark');
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

function updateScrollOffset() {
    const offset = topbar.offsetHeight + 16;
    rootElement.style.setProperty('--nav-offset', `${offset}px`);
}

function scrollToSection(event) {
    const targetId = event.currentTarget.getAttribute('href');
    if (!targetId.startsWith('#')) {
        return;
    }

    event.preventDefault();
    closeMobileMenu();
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        const offset = topbar.offsetHeight + 16;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
        });
    }
}

function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
}

function updateHeaderState() {
    const scrolled = window.scrollY > 20;
    document.querySelector('.topbar').classList.toggle('scrolled', scrolled);
}

themeToggle.addEventListener('click', () => {
    setTheme(!rootElement.classList.contains('dark'));
});

menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(!expanded));
});

navLinks.forEach((link) => {
    link.addEventListener('click', scrollToSection);
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
        closeMobileMenu();
    }
    updateScrollOffset();
});

window.addEventListener('scroll', () => {
    updateHeaderState();
});

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    },
    {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
    }
);

sections.forEach((section) => sectionObserver.observe(section));

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
updateHeaderState();
updateScrollOffset();
