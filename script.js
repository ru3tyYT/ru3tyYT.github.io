// Spotlight Effect Tracker
const spotlight = document.querySelector('.spotlight');
window.addEventListener('mousemove', (e) => {
    if (spotlight) {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    }
});

// Typing animation
const words = ['AI Enthusiast', 'Modern Solutions Coder', 'Software Engineer', 'System Architect', 'Mod & Admin'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function type() {
    if (!typingElement) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let timeout = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        timeout = 2500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeout = 500;
    }

    setTimeout(type, timeout);
}

// Start typing animation
type();

// Navigation active state on scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
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

window.addEventListener('scroll', updateActiveNav);

// Intersection Observer for scroll-reveal
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

// Skill Item Colors
document.querySelectorAll('.skill-item').forEach(item => {
    const color = item.getAttribute('data-color');
    if (color) {
        item.style.setProperty('--skill-color', color);
    }
});

// Mobile Nav Toggle (Optional enhancement if burger menu added)
// For now, the CSS hides it, but we can add a toggle if needed.

// Availability Badge Interactions
const profileWrapper = document.querySelector('.profile-wrapper');
if (profileWrapper) {
    profileWrapper.addEventListener('click', () => {
        const tooltip = document.querySelector('.badge-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-50%) translateX(0)';
            setTimeout(() => {
                tooltip.style.opacity = '';
                tooltip.style.transform = '';
            }, 3000);
        }
    });
}
// 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.project-card, .experience-card, .contact-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// Discord Member Count Fetcher
async function updateDiscordMemberCount() {
    try {
        const response = await fetch('https://discord.com/api/v9/invites/revolutionmacro?with_counts=true');
        const data = await response.json();
        const totalMembers = data.approximate_member_count;
        const memberCountElement = document.getElementById('discord-member-count');
        
        if (memberCountElement && totalMembers) {
            // Count up animation effect (optional but premium feel)
            const startCount = parseInt(memberCountElement.textContent.replace(/,/g, '')) || 0;
            const endCount = totalMembers;
            const duration = 2000;
            const startTime = performance.now();

            function animate(currentTime) {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime < duration) {
                    const progress = elapsedTime / duration;
                    const currentCount = Math.floor(startCount + (endCount - startCount) * progress);
                    memberCountElement.textContent = `${currentCount.toLocaleString()}+ Total Members`;
                    requestAnimationFrame(animate);
                } else {
                    memberCountElement.textContent = `${endCount.toLocaleString()}+ Total Members`;
                }
            }
            
            if (startCount === 0) {
                requestAnimationFrame(animate);
            } else {
                memberCountElement.textContent = `${totalMembers.toLocaleString()}+ Total Members`;
            }
        }
    } catch (error) {
        console.error('Error fetching Discord member count:', error);
        const memberCountElement = document.getElementById('discord-member-count');
        if (memberCountElement && memberCountElement.textContent === 'Loading Members...') {
            memberCountElement.textContent = '58,000+ Total Members'; // Fallback
        }
    }
}

// Initial fetch
updateDiscordMemberCount();

// Auto-refresh every 5 minutes
setInterval(updateDiscordMemberCount, 5 * 60 * 1000);
