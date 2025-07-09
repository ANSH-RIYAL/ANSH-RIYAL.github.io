// Global variables
let projectsData = [];
let experienceData = [];
let skillsData = [];

// DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadFeaturedProjects();
    setupScrollEffects();
    setupNavigation();
});

// Initialize application
function initializeApp() {
    // Add loading states
    showLoading();
    
    // Load all data
    Promise.all([
        loadData('data/projects.json'),
        loadData('data/experience.json'),
        loadData('data/skills.json')
    ]).then(([projects, experience, skills]) => {
        projectsData = projects;
        experienceData = experience;
        skillsData = skills;
        hideLoading();
    }).catch(error => {
        console.error('Error loading data:', error);
        hideLoading();
    });
}

// Load data from JSON files
async function loadData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return [];
    }
}

// Load featured projects on homepage
function loadFeaturedProjects() {
    const featuredContainer = document.getElementById('featured-projects');
    if (!featuredContainer) return;

    // Show loading
    featuredContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    // Load projects data
    loadData('data/projects.json').then(data => {
        const projects = data.projects || data;
        const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
        featuredContainer.innerHTML = '';

        featuredProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            featuredContainer.appendChild(projectCard);
        });
    }).catch(error => {
        console.error('Error loading featured projects:', error);
        featuredContainer.innerHTML = '<p class="text-center text-muted">Error loading projects</p>';
    });
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'col-lg-4 col-md-6 mb-4';
    
    const techTags = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');

    card.innerHTML = `
        <div class="project-card">
            <div class="card-header">
                <h4>${project.title}</h4>
                <p class="mb-0">${project.subtitle}</p>
            </div>
            <div class="card-body">
                <p class="text-muted mb-3">${project.description}</p>
                <div class="tech-stack mb-3">
                    ${techTags}
                </div>
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" class="btn btn-outline-primary btn-sm me-2" target="_blank">
                        <i class="fab fa-github me-1"></i>GitHub
                    </a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" class="btn btn-outline-success btn-sm" target="_blank">
                        <i class="fas fa-external-link-alt me-1"></i>Demo
                    </a>` : ''}
                </div>
            </div>
        </div>
    `;

    return card;
}

// Setup scroll effects
function setupScrollEffects() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Setup navigation
function setupNavigation() {
    // Active navigation link highlighting
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Project filtering functionality
function setupProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const cardCategories = card.dataset.categories.split(',');
                if (category === 'all' || cardCategories.includes(category)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('.card-body p').textContent.toLowerCase();
            const technologies = card.querySelectorAll('.tech-tag');
            
            let techText = '';
            technologies.forEach(tech => {
                techText += tech.textContent.toLowerCase() + ' ';
            });

            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                techText.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Loading states
function showLoading() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.style.display = 'flex';
    });
}

function hideLoading() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.style.display = 'none';
    });
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function createTechTag(technology) {
    return `<span class="tech-tag">${technology}</span>`;
}

function createStarRating(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push('<i class="fas fa-star text-warning"></i>');
        } else {
            stars.push('<i class="far fa-star text-muted"></i>');
        }
    }
    return stars.join('');
}

// Analytics and tracking
function trackEvent(eventName, eventData) {
    // Analytics tracking would go here
    console.log(`Event: ${eventName}`, eventData);
}

// Contact form handling
function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Contact form submitted:', data);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        this.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Dark mode toggle
function setupDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDark);
        
        // Update toggle icon
        const icon = this.querySelector('i');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });

    // Load saved preference
    const savedDarkMode = localStorage.getItem('dark-mode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-sun';
    }
}

// Initialize additional features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupProjectFiltering();
    setupSearch();
    handleContactForm();
    setupDarkMode();
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'danger');
});

// Service Worker registration (for offline capability)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
