// Fonction throttle pour optimiser les performances
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    if (hamburger && navMenu && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                if (hamburger.hasAttribute('aria-expanded')) {
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Smooth scrolling for navigation links
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Si c'est un lien vers une autre page, laisser le comportement normal
                if (targetId.includes('.html') || targetId.includes('http')) {
                    return; // Laisser le lien fonctionner normalement
                }
                
                // Sinon, faire le smooth scroll pour les ancres
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Navbar background on scroll (avec throttle)
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }, 100));
    }

    // Active navigation link highlighting (avec throttle)
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', throttle(function() {
            let current = '';
            const scrollPosition = window.scrollY + 150; // Offset pour la détection
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionBottom = sectionTop + sectionHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });

            // Si on est proche de la fin de la page, activer la section contact
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                current = 'contact';
            }

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }

    // Animation on scroll (désactivée si prefers-reduced-motion)
    if (!reducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.skill-card, .timeline-item, .contact-link, .mission-card');
        if (animateElements.length > 0) {
            animateElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }
    }

    // CV Download functionality (placeholder)
    const cvButton = document.querySelector('a[href="#contact"]');
    if (cvButton && cvButton.textContent.includes('Télécharger')) {
        cvButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Le CV sera disponible prochainement. En attendant, vous pouvez me contacter via les liens de contact.');
        });
    }

    // Contact links functionality
    // Ne bloquer que les vrais placeholders (example.com)
    const contactLinks = document.querySelectorAll('.contact-link');
    if (contactLinks.length > 0) {
        contactLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // Bloquer uniquement les liens avec example.com (placeholder)
                if (href && href.includes('example.com')) {
                    e.preventDefault();
                    alert('Les liens de contact seront mis à jour avec les vraies adresses. En attendant, vous pouvez me contacter via email.');
                }
                // Les autres liens (LinkedIn, GitHub) fonctionnent normalement
            });
        });
    }

    // Mission filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const missionCards = document.querySelectorAll('.mission-card');

    if (filterButtons.length > 0 && missionCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                missionCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.classList.add('fade-in');
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('fade-in');
                    }
                });
            });
        });
    }

    // Bouton de remontée de page
    const scrollToTopButton = document.getElementById('scrollToTop');
    
    if (scrollToTopButton) {
        // Afficher/masquer le bouton selon la position de scroll (avec throttle)
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 300) {
                scrollToTopButton.classList.add('show');
            } else {
                scrollToTopButton.classList.remove('show');
            }
        }, 100));

        // Fonction pour remonter en haut de la page
        scrollToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Les liens PDF restent inchangés: ils doivent correspondre exactement
    // aux noms des fichiers présents dans le dossier docs.
});

// (Styles "active" du menu gérés en CSS statique dans styles.css)
