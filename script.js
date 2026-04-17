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
        const headerHeight = topbar.offsetHeight;
        const sectionRect = targetSection.getBoundingClientRect();
        const sectionHeight = sectionRect.height;
        const viewportHeight = window.innerHeight;
        const sectionTop = targetSection.offsetTop;
        const availableSpace = viewportHeight - headerHeight;

        let targetPosition;
        if (sectionHeight < availableSpace) {
            const centerOffset = (availableSpace - sectionHeight) / 2;
            targetPosition = sectionTop - headerHeight - centerOffset;
        } else {
            targetPosition = sectionTop - headerHeight - 16;
        }

        targetPosition = Math.max(0, targetPosition);

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

// Mini game logic
const gameScore = document.getElementById('gameScore');
const gameTimer = document.getElementById('gameTimer');
const gameStart = document.getElementById('gameStart');
const gameReset = document.getElementById('gameReset');
const gameArea = document.getElementById('gameArea');
const targetButton = document.getElementById('targetButton');
const gameFeedback = document.getElementById('gameFeedback');

let gameScoreValue = 0;
let gameTimeLeft = 15;
let gameActive = false;
let timerInterval = null;
let targetTimeout = null;

function setGameStatus(score, time) {
    gameScore.textContent = score;
    gameTimer.textContent = time;
}

function resetGame() {
    clearInterval(timerInterval);
    clearTimeout(targetTimeout);
    gameActive = false;
    gameScoreValue = 0;
    gameTimeLeft = 15;
    targetButton.classList.add('hidden');
    gameFeedback.textContent = 'Ready when you are. Keep the score high and stay focused.';
    setGameStatus(gameScoreValue, gameTimeLeft);
}

function stopGame(message) {
    gameActive = false;
    clearInterval(timerInterval);
    clearTimeout(targetTimeout);
    targetButton.classList.add('hidden');
    gameFeedback.textContent = message || `Game over! Your score is ${gameScoreValue}.`;
}

function placeTarget() {
    if (!gameActive) return;

    const areaRect = gameArea.getBoundingClientRect();
    const targetSize = targetButton.offsetWidth;
    const x = Math.max(0, Math.random() * (areaRect.width - targetSize));
    const y = Math.max(0, Math.random() * (areaRect.height - targetSize));

    targetButton.style.transform = `translate(${x}px, ${y}px)`;
    targetButton.classList.remove('hidden');
}

function scheduleNextTarget() {
    targetButton.classList.add('hidden');

    targetTimeout = setTimeout(() => {
        if (!gameActive) return;
        placeTarget();
        gameFeedback.textContent = 'Tap the target!';
    }, 600 + Math.random() * 900);
}

function startGame() {
    if (gameActive) return;
    resetGame();
    gameActive = true;
    gameFeedback.textContent = 'Get ready...';

    timerInterval = setInterval(() => {
        gameTimeLeft -= 1;
        setGameStatus(gameScoreValue, gameTimeLeft);

        if (gameTimeLeft <= 0) {
            stopGame('Time is up! Great work.');
        }
    }, 1000);

    scheduleNextTarget();
}

function handleTargetHit() {
    if (!gameActive) return;
    gameScoreValue += 1;
    setGameStatus(gameScoreValue, gameTimeLeft);
    gameFeedback.textContent = 'Nice hit! Prepare for the next target.';
    scheduleNextTarget();
}

if (gameStart && gameReset && targetButton) {
    gameStart.addEventListener('click', startGame);
    gameReset.addEventListener('click', resetGame);
    targetButton.addEventListener('click', handleTargetHit);
    resetGame();
}

loadTheme();
updateHeaderState();
updateScrollOffset();
