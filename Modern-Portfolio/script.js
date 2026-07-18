document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. Loading Preloader
    // ==========================================================================
    const preloader = document.getElementById("preloader");
    
    // Simulate loading completion
    window.addEventListener("load", () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";
            }
            // Trigger initial reveal animations
            revealOnScroll();
            
            // Trigger profile photo entrance animation
            if (window.playProfileEntrance) {
                window.playProfileEntrance();
            }
        }, 1200); // 1.2s delay for visual boot-up feel
    });

    // ==========================================================================
    // 2. Custom Cursor & Interactive Glow
    // ==========================================================================
    const cursorDot = document.querySelector(".custom-cursor-dot");
    const cursorOutline = document.querySelector(".custom-cursor-outline");
    const ambientGlow = document.querySelector(".cursor-glow");
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the core dot
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });
    
    // Smooth lagging animation for the outline cursor and ambient glow
    function animateCursor() {
        // Outline lag
        const outlineDamp = 0.15; // lower is slower lag
        outlineX += (mouseX - outlineX) * outlineDamp;
        outlineY += (mouseY - outlineY) * outlineDamp;
        
        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        
        // Background glow lag
        const glowDamp = 0.05;
        glowX += (mouseX - glowX) * glowDamp;
        glowY += (mouseY - glowY) * glowDamp;
        
        if (ambientGlow) {
            ambientGlow.style.left = `${glowX}px`;
            ambientGlow.style.top = `${glowY}px`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    // Start cursor animation loop
    animateCursor();
    
    // Cursor hover effects on interactive elements
    const hoverables = document.querySelectorAll("a, button, input, textarea, .project-card, .cert-card-tilt, .tech-card, .education-card-wrapper, .social-link");
    
    hoverables.forEach(item => {
        item.addEventListener("mouseenter", () => {
            document.body.classList.add("hovered");
        });
        item.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovered");
        });
    });

    // ==========================================================================
    // 3. Animated Roles Typewriter Engine & 3D Interactive Controls
    // ==========================================================================
    const typedTextEl = document.getElementById("typed-text");
    const roleIconWrappers = document.querySelectorAll(".hero-role-icons-container .role-icon-wrapper");
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const roles = [
        { text: "Flutter Developer", icon: "flutter" },
        { text: "Web Developer", icon: "frontend" },
        { text: "UI/UX Designer", icon: "uiux" }
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;
    let isPaused = false;
    let typewriterTimeoutId = null;

    function updateIcons(activeIconId) {
        roleIconWrappers.forEach(icon => {
            if (icon.getAttribute("data-icon") === activeIconId) {
                icon.classList.add("active");
                // Reveal active icon scale and opacity via GSAP
                gsap.to(icon, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)", overwrite: "auto" });
            } else {
                icon.classList.remove("active");
                // Hide other icons
                gsap.to(icon, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            }
        });
    }

    function typeEffect() {
        if (!typedTextEl || isPaused) return;

        const current = roles[roleIndex];
        const fullText = current.text;

        // Ensure the icon is visible as soon as typing begins
        if (charIndex === 0 && !isDeleting) {
            updateIcons(current.icon);
            gsap.to(typedTextEl, { opacity: 1, duration: 0.3 });
        }

        if (isDeleting) {
            // Remove character
            typedTextEl.textContent = fullText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40; // deleting speed
        } else {
            // Add character
            typedTextEl.textContent = fullText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 85; // 70-100ms typing speed
        }

        // State transitions
        if (!isDeleting && charIndex === fullText.length) {
            // Pause for 2 seconds after typing completes
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            
            // Fade out the text and active icon together before moving to the next
            gsap.to([typedTextEl, ".hero-role-icons-container .role-icon-wrapper.active"], {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    roleIndex = (roleIndex + 1) % roles.length;
                    typewriterTimeoutId = setTimeout(typeEffect, 300); // 300ms pause
                }
            });
            return;
        }

        typewriterTimeoutId = setTimeout(typeEffect, typingSpeed);
    }

    // Initialize typewriter loop
    setTimeout(typeEffect, 1500);

    // Cursor 3D Tilting & Interactive Hover Overrides
    if (roleIconWrappers.length > 0 && !isTouch) {
        roleIconWrappers.forEach(icon => {
            gsap.set(icon, { transformPerspective: 600, transformStyle: "preserve-3d" });

            icon.addEventListener("mouseenter", () => {
                // Pause typewriter rotation loop on hover so user can interact
                isPaused = true;
                if (typewriterTimeoutId) {
                    clearTimeout(typewriterTimeoutId);
                    typewriterTimeoutId = null;
                }

                gsap.to(icon, {
                    scale: 1.15,
                    y: -4, // small bounce up
                    boxShadow: "0 15px 30px rgba(0, 229, 255, 0.35)",
                    duration: 0.3,
                    ease: "back.out(2)",
                    overwrite: "auto"
                });
            });

            icon.addEventListener("mousemove", (e) => {
                const rect = icon.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Normalized mouse coordinates (-0.5 to 0.5)
                const normX = (mouseX / rect.width) - 0.5;
                const normY = (mouseY / rect.height) - 0.5;

                // 3D tilt towards mouse position
                gsap.to(icon, {
                    rotateX: -normY * 28,
                    rotateY: normX * 28,
                    duration: 0.2,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });

            icon.addEventListener("mouseleave", () => {
                // Resume typewriter rotation when mouse leaves
                isPaused = false;
                typewriterTimeoutId = setTimeout(typeEffect, 1000); // Resume in 1s

                gsap.to(icon, {
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    y: 0,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        });
    }

    // ==========================================================================
    // 4. Sticky Header & Active Nav Highlighting
    // ==========================================================================
    const header = document.querySelector("header");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    
    window.addEventListener("scroll", () => {
        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        // Active Nav Link highlighting
        let currentSectionId = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
        
        // Show / Hide Back to Top button
        const backToTopBtn = document.getElementById("back-to-top");
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        }
    });

    // ==========================================================================
    // 5. Mobile Navigation Menu Toggle
    // ==========================================================================
    const menuBtn = document.getElementById("menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navMenuLinks = document.querySelectorAll(".nav-link");
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                if (navMenu.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });
        
        // Close menu on click of nav link
        navMenuLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    // ==========================================================================
    // 6. Intersection Observer for Scroll Reveals
    // ==========================================================================
    const revealElements = document.querySelectorAll(".reveal");
    
    function revealOnScroll() {
        const revealBound = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < revealBound) {
                el.classList.add("active");
            }
        });
    }
    
    // Add scroll listener for reveals
    window.addEventListener("scroll", revealOnScroll);
    
    // Trigger once on startup (after preloader)
    revealOnScroll();

    // ==========================================================================
    // 7. Click Ripple Animation for Buttons
    // ==========================================================================
    const rippleButtons = document.querySelectorAll(".btn, .btn-submit");
    
    rippleButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            // Remove any existing ripples
            const existingRipples = this.querySelectorAll(".ripple-effect");
            existingRipples.forEach(r => r.remove());
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement("span");
            ripple.classList.add("ripple-effect");
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Append styling inline or ensure it fits style.css
            ripple.style.position = "absolute";
            ripple.style.transform = "translate(-50%, -50%) scale(0)";
            ripple.style.width = "200px";
            ripple.style.height = "200px";
            ripple.style.borderRadius = "50%";
            ripple.style.background = "rgba(255, 255, 255, 0.25)";
            ripple.style.pointerEvents = "none";
            ripple.style.animation = "rippleAnim 0.6s ease-out";
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add keyframes dynamically for button ripple
    if (!document.getElementById("ripple-keyframes")) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "ripple-keyframes";
        styleSheet.innerText = `
            @keyframes rippleAnim {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // ==========================================================================
    // 8. Back to Top Button Interaction
    // ==========================================================================
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ==========================================================================
    // 9. Contact Form Overlay & Interactive Feedback
    // ==========================================================================
    const contactForm = document.querySelector("form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Get values
            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const msgInput = contactForm.querySelector('textarea');
            
            if (!nameInput.value || !emailInput.value || !msgInput.value) {
                showToast("Please fill in all fields.", "error");
                return;
            }
            
            // Simulate sending message
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.style.background = "rgba(123, 97, 255, 0.5)";
            
            setTimeout(() => {
                showToast("Message sent successfully! Hari will contact you soon.", "success");
                triggerConfetti();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = "";
                contactForm.reset();
            }, 1800);
        });
    }

    // ==========================================================================
    // Confetti burst from bottom corners on successful form submission
    // ==========================================================================
    function triggerConfetti() {
        const colors = [
            '#00e5ff', // neon cyan
            '#7b61ff', // neon purple
            '#ff00c8', // neon pink
            '#ffeb3b', // bright yellow
            '#00ff66', // bright green
            '#ff5722'  // vibrant orange
        ];

        const particleCount = 80;

        // Burst from bottom-left corner
        createConfettiBurst(0, window.innerHeight, 45, colors, particleCount / 2);

        // Burst from bottom-right corner
        createConfettiBurst(window.innerWidth, window.innerHeight, 135, colors, particleCount / 2);
    }

    function createConfettiBurst(startX, startY, angleDeg, colors, count) {
        for (let i = 0; i < count; i++) {
            const el = document.createElement("div");
            el.className = "confetti-particle";
            
            // Random paper dimension configurations
            const color = colors[Math.floor(Math.random() * colors.length)];
            const sizeWidth = Math.floor(Math.random() * 8) + 6; // 6px to 14px
            const sizeHeight = Math.floor(Math.random() * 12) + 8; // 8px to 20px
            
            el.style.width = `${sizeWidth}px`;
            el.style.height = `${sizeHeight}px`;
            el.style.backgroundColor = color;
            el.style.borderRadius = Math.random() > 0.5 ? '2px' : '0px';
            el.style.position = "fixed";
            el.style.left = `${startX}px`;
            el.style.top = `${startY}px`;
            el.style.zIndex = "10002";
            el.style.pointerEvents = "none";
            
            document.body.appendChild(el);

            // Vector trajectory and friction kinematics
            const angleRad = (angleDeg + (Math.random() * 30 - 15)) * Math.PI / 180;
            const velocity = (Math.random() * 20) + 12; // initial explosion force
            
            let vx = Math.cos(angleRad) * velocity;
            let vy = -Math.sin(angleRad) * velocity; // negative value vectors upward
            let posX = startX;
            let posY = startY;
            let rotation = Math.random() * 360;
            let rotationSpeed = Math.random() * 12 - 6;
            let opacity = 1;
            let scale = 1;
            const gravity = 0.5;
            const friction = 0.98;

            function updatePhysics() {
                vx *= friction;
                vy += gravity;
                posX += vx;
                posY += vy;
                rotation += rotationSpeed;

                // Fade out particle as it begins descent
                if (vy > 0) {
                    opacity -= 0.015;
                }

                el.style.transform = `translate(${posX - startX}px, ${posY - startY}px) rotate(${rotation}deg) scale(${scale})`;
                el.style.opacity = opacity;

                if (opacity > 0 && posY < window.innerHeight + 50 && posX > -50 && posX < window.innerWidth + 50) {
                    requestAnimationFrame(updatePhysics);
                } else {
                    el.remove();
                }
            }

            requestAnimationFrame(updatePhysics);
        }
    }

    // Beautiful Toast Notifications
    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle"}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styling elements
        toast.style.position = "fixed";
        toast.style.bottom = "30px";
        toast.style.left = "30px";
        toast.style.background = type === "success" ? "rgba(13, 30, 24, 0.9)" : "rgba(35, 15, 20, 0.9)";
        toast.style.border = type === "success" ? "1px solid #10b981" : "1px solid #f43f5e";
        toast.style.boxShadow = type === "success" ? "0 0 15px rgba(16, 185, 129, 0.2)" : "0 0 15px rgba(244, 63, 94, 0.2)";
        toast.style.color = "#ffffff";
        toast.style.padding = "16px 24px";
        toast.style.borderRadius = "12px";
        toast.style.backdropFilter = "blur(12px)";
        toast.style.zIndex = "10001";
        toast.style.transform = "translateY(20px)";
        toast.style.opacity = "0";
        toast.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        
        document.body.appendChild(toast);
        
        // Trigger reflow
        toast.offsetHeight;
        
        // Slide up & fade in
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.transform = "translateY(20px)";
            toast.style.opacity = "0";
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    }

    // ==========================================================================
    // 10. Certificates 3D Tilt & Glare Effect
    // ==========================================================================
    const certCards = document.querySelectorAll(".cert-card-tilt");
    
    certCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // cursor X inside element
            const y = e.clientY - rect.top;  // cursor Y inside element
            
            const width = rect.width;
            const height = rect.height;
            
            // Calculate cursor deviation from card center (-1 to 1)
            const dx = (x - width / 2) / (width / 2);
            const dy = (y - height / 2) / (height / 2);
            
            // Rotations (max 15 degrees)
            const rotX = -dy * 15;
            const rotY = dx * 15;
            
            // Shadows shift in opposite direction
            const shadowX = -dx * 18;
            const shadowY = -dy * 18 + 15;
            
            // Use requestAnimationFrame for smooth drawing
            requestAnimationFrame(() => {
                card.classList.add("active-tilt");
                card.style.setProperty("--rotX", `${rotX}deg`);
                card.style.setProperty("--rotY", `${rotY}deg`);
                card.style.setProperty("--glare-x", `${x}px`);
                card.style.setProperty("--glare-y", `${y}px`);
                card.style.setProperty("--shadow-x", `${shadowX}px`);
                card.style.setProperty("--shadow-y", `${shadowY}px`);
            });
        });
        
        card.addEventListener("mouseleave", () => {
            requestAnimationFrame(() => {
                card.classList.remove("active-tilt");
                card.style.removeProperty("--rotX");
                card.style.removeProperty("--rotY");
                card.style.removeProperty("--glare-x");
                card.style.removeProperty("--glare-y");
                card.style.removeProperty("--shadow-x");
                card.style.removeProperty("--shadow-y");
            });
        });
    });

    // ==========================================================================
    // 11. Certificates Staggered Scroll Reveal Trigger
    // ==========================================================================
    const revealCerts = document.querySelectorAll(".reveal-cert");
    
    function revealCertsOnScroll() {
        const revealBound = window.innerHeight * 0.88;
        
        revealCerts.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < revealBound) {
                el.classList.add("active");
            }
        });
    }
    
    // Add scroll listener
    window.addEventListener("scroll", revealCertsOnScroll);
    // Double check on startup
    revealCertsOnScroll();

    // ==========================================================================
    // 12. Resume & GitHub Project Modal Functionality
    // ==========================================================================
        const resumeBtn = document.getElementById("view-resume-btn");
    const resumeModal = document.getElementById("resume-modal");
    const modalCloseBtn = resumeModal ? resumeModal.querySelector(".btn-modal-close") : null;
    const modalIframe = resumeModal ? resumeModal.querySelector(".resume-iframe") : null;

    if (resumeBtn && resumeModal) {
        resumeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (modalIframe) modalIframe.src = "final resume.pdf";
            resumeModal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent body scroll
        });
    }

    if (resumeModal && modalCloseBtn) {
        const closeModal = () => {
            resumeModal.classList.remove("active");
            document.body.style.overflow = ""; // Enable body scroll
            if (modalIframe) modalIframe.src = ""; // Stop PDF rendering when closed
        };

        modalCloseBtn.addEventListener("click", closeModal);

        // Close on clicking outside the modal container
        resumeModal.addEventListener("click", (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });

        // Close on Escape key press
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && resumeModal.classList.contains("active")) {
                closeModal();
            }
        });
    }

    // ==========================================================================
    // 13. Profile Image Premium Entrance & 3D Interactive Hover System
    // ==========================================================================
    const profileFrame = document.querySelector(".profile-frame");
    if (profileFrame) {
        let floatTimeline = null;

        // Custom Entrance Animation using GSAP
        window.playProfileEntrance = function() {
            gsap.to(profileFrame, {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.9,
                ease: "power4.out", // Luxurious cinematic deceleration matching cubic-bezier(0.19, 1, 0.22, 1)
                onComplete: () => {
                    startProfileFloating();
                    initProfileHover();
                }
            });
        };

        // Gentle Floating Loop
        function startProfileFloating() {
            floatTimeline = gsap.timeline({ repeat: -1 });
            floatTimeline.to(profileFrame, {
                y: -7, // float up by 7px
                duration: 3,
                ease: "power1.inOut"
            }).to(profileFrame, {
                y: 7, // float down by 7px
                duration: 3,
                ease: "power1.inOut"
            });
        }

        // 3D Tilt and Purple Specular Glow on Hover
        function initProfileHover() {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (isTouchDevice) return; // Disable hover tilts on touch devices

            profileFrame.addEventListener("mouseenter", () => {
                if (floatTimeline) {
                    floatTimeline.pause(); // Pause floating animation
                }

                gsap.to(profileFrame, {
                    scale: 1.03,
                    boxShadow: "0 0 45px rgba(123, 97, 255, 0.65)", // soft purple glow backdrop
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            profileFrame.addEventListener("mousemove", (e) => {
                const rect = profileFrame.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Normalize coordinate vectors (-0.5 to 0.5)
                const normX = (mouseX / rect.width) - 0.5;
                const normY = (mouseY / rect.height) - 0.5;

                // Subtle 3D tilt tracking cursor
                gsap.to(profileFrame, {
                    rotateX: -normY * 12,
                    rotateY: normX * 12,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });

            profileFrame.addEventListener("mouseleave", () => {
                if (floatTimeline) {
                    floatTimeline.resume(); // Resume floating loop
                }

                gsap.to(profileFrame, {
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)", // reset to default shadow
                    duration: 0.6,
                    ease: "power3.out"
                });
            });
        }
    }

});
