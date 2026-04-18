// Matter.js Physics Engine
let engine, world, bodies = [];
const contentWrapper = document.getElementById('content-wrapper');

// Initialize Physics
function initPhysics() {
    engine = Matter.Engine.create();
    world = engine.world;
    engine.world.gravity.y = 0.5;
    
    Matter.Renderer.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    Matter.Runner.run(engine);
    Matter.Events.on(engine, 'collisionStart', handleCollision);
}

// Create physics bodies for elements
function createPhysicsBodies() {
    document.querySelectorAll('.physics-item').forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const body = Matter.Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            {
                restitution: 0.6,
                frictionAir: 0.01,
                density: 0.001,
                render: { visible: false }
            }
        );
        
        bodies.push({ element: el, body, originalY: rect.top });
        Matter.World.add(world, body);
    });
}

// Handle collisions (falling effect)
function handleCollision(event) {
    event.pairs.forEach(pair => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        const objA = bodies.find(b => b.body === bodyA);
        const objB = bodies.find(b => b.body === bodyB);
        
        if (objA && objB) {
            // Add some rotation and bounce
            Matter.Body.setAngularVelocity(objA.body, (Math.random() - 0.5) * 0.1);
            Matter.Body.setAngularVelocity(objB.body, (Math.random() - 0.5) * 0.1);
        }
    });
}

// Animate physics elements falling
function triggerPhysicsFall() {
    setTimeout(() => {
        bodies.forEach(({ element, body }) => {
            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 10,
                y: Math.random() * 20
            });
            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
        });
        
        // Hide content temporarily
        contentWrapper.style.opacity = '0';
        contentWrapper.style.pointerEvents = 'none';
        
        // Reset after 3 seconds
        setTimeout(() => {
            resetPhysics();
        }, 3000);
    }, 100);
}

function resetPhysics() {
    bodies.forEach(({ element, body, originalY }) => {
        Matter.Body.setPosition(body, {
            x: body.position.x,
            y: originalY + window.scrollY
        });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);
    });
    
    contentWrapper.style.opacity = '1';
    contentWrapper.style.pointerEvents = 'auto';
}

// Mouse interaction with physics
document.addEventListener('mousemove', (e) => {
    if (bodies.length > 0) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        bodies.forEach(({ body }) => {
            const dx = mouseX * 0.02;
            const dy = mouseY * 0.02;
            Matter.Body.applyForce(body, body.position, { x: dx, y: dy });
        });
    }
});

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles.js Background
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#00f0ff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#00f0ff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    // Wait for particles.js to load
    setTimeout(() => {
        initPhysics();
        createPhysicsBodies();
    }, 1000);
    
    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        reveal();
    });

    // Scroll Reveal
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach((el, i) => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 80;

            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });

        // Scroll Progress Bar
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        }
    }

    reveal();

    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const cursorOutline = document.getElementById('custom-cursor-outline');

    if (cursor && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursor.style.left = `${posX}px`;
            cursor.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        document.querySelectorAll('a, button, .industry-card, .faq-question').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.borderColor = 'var(--neon-purple)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderColor = 'var(--neon-blue)';
            });
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Stats Counter
    const counters = document.querySelectorAll('.stat-number');
    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/[^\d]/g, '');
                const inc = target / 150;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + (target > 50 ? '+' : '%');
                }
            };

            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) {
                    updateCount();
                    observer.unobserve(counter);
                }
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    };

    startCounters();

    const clickSound = document.getElementById('click-sound');
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousedown', () => {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => {});
            }
        });
    });

    // Physics trigger on double-click spacebar
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.ctrlKey) {
            e.preventDefault();
            triggerPhysicsFall();
        }
    });
});