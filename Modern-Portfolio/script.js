document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. Loading Preloader (Cinematic Brand Logo Initialization)
    // ==========================================================================
    const preloader = document.getElementById("preloader");
    const loaderPercentage = document.querySelector(".loader-percentage");
    
    // Lock scroll during initialization
    document.body.style.overflow = "hidden";
    
    // Prepare wing feathers for entrance
    const leftFeathers = document.querySelectorAll(".left-feather");
    const rightFeathers = document.querySelectorAll(".right-feather");
    const bodyMain = document.getElementById("body-main");
    const tailFeather = document.getElementById("tail-feather-main");
    const bgGlow = document.getElementById("loader-bg-glow");
    const logoSvg = document.getElementById("loader-phoenix-svg");
    
    // Set initial off-screen / invisible states to prevent FOUC (flash of unstyled content)
    if (leftFeathers.length > 0) {
        gsap.set(leftFeathers, { x: -450, opacity: 0, rotation: -40, filter: "blur(6px)" });
    }
    if (rightFeathers.length > 0) {
        gsap.set(rightFeathers, { x: 450, opacity: 0, rotation: 40, filter: "blur(6px)" });
    }
    if (bodyMain) {
        gsap.set(bodyMain, { y: -250, opacity: 0, scale: 0.7 });
    }
    if (tailFeather) {
        gsap.set(tailFeather, { opacity: 0, scaleY: 0, transformOrigin: "top center" });
    }
    if (bgGlow) {
        gsap.set(bgGlow, { opacity: 0, scale: 0.5 });
    }
    
    // Start timeline on window load
    window.addEventListener("load", () => {
        const loaderTimeline = gsap.timeline({
            onComplete: () => {
                // Unlock scroll
                document.body.style.overflow = "";
                
                // Fade out preloader container
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        if (preloader) {
                            preloader.style.display = "none";
                        }
                        // Trigger scroll reveals and profile card animation
                        revealOnScroll();
                        if (window.playProfileEntrance) {
                            window.playProfileEntrance();
                        }
                    }
                });
            }
        });
        
        // 0.0s: Progress bar width fill animation (0% to 100%)
        loaderTimeline.to(".loader-progress-bar-fill", {
            width: "100%",
            duration: 2.2,
            ease: "power1.out"
        }, 0);
        
        // 0.3s: Left Wing Feathers fly in from the left, staggered
        loaderTimeline.to(leftFeathers, {
            x: 0,
            opacity: 1,
            rotation: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            stagger: {
                each: 0.08,
                from: "end" // assemblies from outer/bottom-most upwards
            }
        }, 0.3);
        
        // 0.3s: Right Wing Feathers fly in from the right, staggered (mirrored)
        loaderTimeline.to(rightFeathers, {
            x: 0,
            opacity: 1,
            rotation: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            stagger: {
                each: 0.08,
                from: "end"
            }
        }, 0.3);
        
        // 0.6s: Central Body descends from the top
        loaderTimeline.to(bodyMain, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power2.out"
        }, 0.6);
        
        // 1.5s: Tail Feathers grow downward
        loaderTimeline.to(tailFeather, {
            opacity: 1,
            scaleY: 1,
            duration: 1.0,
            ease: "back.out(1.2)"
        }, 1.5);
        
        // 2.2s: All parts merge / Energy pulse starts
        loaderTimeline.to(logoSvg, {
            scale: 1.06,
            duration: 0.2,
            ease: "power2.out"
        }, 2.2);
        
        // Soft red ambient glow behind the logo fades in and expands
        loaderTimeline.to(bgGlow, {
            opacity: 0.35,
            scale: 1.2,
            duration: 0.3,
            ease: "power2.out"
        }, 2.2);
        
        // 2.4s: Settle logo scale and light glow release
        loaderTimeline.to(logoSvg, {
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
        }, 2.4);
        
        loaderTimeline.to(bgGlow, {
            opacity: 0.2,
            scale: 1.0,
            duration: 0.6,
            ease: "power2.out"
        }, 2.4);
        
        // 3.0s: Dissolve logo slightly and scale down to fade into homepage
        loaderTimeline.to(logoSvg, {
            scale: 0.94,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
        }, 3.0);
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
        // Toggling segmented controls on send method radio change
        const sendMethodRadios = contactForm.querySelectorAll('input[name="send_method"]');
        const toggleWrapper = contactForm.querySelector('.send-to-toggle-wrapper');
        const helperText = contactForm.querySelector('#send-to-helper');

        sendMethodRadios.forEach(radio => {
            radio.addEventListener("change", () => {
                contactForm.querySelectorAll(".toggle-option").forEach(opt => {
                    opt.classList.remove("active");
                });
                
                const currentOpt = radio.closest(".toggle-option");
                if (currentOpt) {
                    currentOpt.classList.add("active");
                }

                if (radio.value === "whatsapp") {
                    if (toggleWrapper) toggleWrapper.classList.add("whatsapp-active");
                    if (helperText) {
                        helperText.innerHTML = '<i class="fab fa-whatsapp"></i> Chat conversation will open instantly in WhatsApp.';
                    }
                } else {
                    if (toggleWrapper) toggleWrapper.classList.remove("whatsapp-active");
                    if (helperText) {
                        helperText.innerHTML = '<i class="fas fa-envelope"></i> Message will be sent directly to Hari\'s inbox.';
                    }
                }
            });
        });

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Get values
            const nameInput = contactForm.querySelector('input[placeholder="Your Name"]');
            const emailInput = contactForm.querySelector('input[placeholder="your.email@example.com"]');
            const msgInput = contactForm.querySelector('textarea');
            
            if (!nameInput || !emailInput || !msgInput) return;
            
            if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
                showToast("Please fill in all fields.", "error");
                return;
            }
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = msgInput.value.trim();
            
            // Get selected method
            const selectedMethodEl = contactForm.querySelector('input[name="send_method"]:checked');
            const method = selectedMethodEl ? selectedMethodEl.value : "email";
            
            // UI states
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : "Send Message";
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.style.background = "rgba(123, 97, 255, 0.5)";
            }
            
            if (method === "email") {
                // Submit to Web3Forms API
                const payload = {
                    access_key: "f11a3b5b-2f94-4c0a-88e9-680bbc3d900c",
                    name: name,
                    email: email,
                    message: message,
                    subject: `Portfolio Inquiry from ${name}`
                };
                
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                })
                .then(async (response) => {
                    const json = await response.json();
                    if (response.status === 200) {
                        showToast("Message sent successfully! Hari will contact you soon.", "success");
                        triggerConfetti();
                        contactForm.reset();
                        resetFormControls();
                    } else {
                        console.error(json);
                        showToast(json.message || "Failed to send message via Web3Forms.", "error");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    showToast("Oops! Network error occurred. Please try again.", "error");
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = "";
                    }
                });
                
            } else if (method === "whatsapp") {
                // For WhatsApp, we open wa.me and trigger success animations locally
                setTimeout(() => {
                    const text = `*Portfolio Inquiry*\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;
                    const whatsappUrl = `https://wa.me/919345951450?text=${encodeURIComponent(text)}`;
                    window.open(whatsappUrl, "_blank");

                    showToast("Redirecting to WhatsApp... Chat draft prepared!", "success");
                    triggerConfetti();
                    
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = "";
                    }
                    contactForm.reset();
                    resetFormControls();
                }, 1000);
            }
            
            function resetFormControls() {
                // Reset toggle switch state to default (Email active)
                if (toggleWrapper) toggleWrapper.classList.remove("whatsapp-active");
                if (helperText) {
                    helperText.innerHTML = '<i class="fas fa-envelope"></i> Message will be sent directly to Hari\'s inbox.';
                }
                contactForm.querySelectorAll(".toggle-option").forEach((opt, idx) => {
                    if (idx === 0) {
                        opt.classList.add("active");
                        const r = opt.querySelector('input[type="radio"]');
                        if (r) r.checked = true;
                    } else {
                        opt.classList.remove("active");
                    }
                });
            }
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
    // 10. Certificates Section Horizontal Scrolling Marquee (GSAP)
    // ==========================================================================
    const certTrack = document.querySelector(".certifications-track");
    const certTrackWrapper = document.querySelector(".certifications-track-wrapper");

    if (certTrack && certTrackWrapper) {
        // Infinite seamless loop marquee using GSAP
        // Translates from 0% to -50% (exactly one full duplicate set of cards width)
        const marqueeSpeed = 32; // duration of one full cycle in seconds
        
        let tickerTween = gsap.to(certTrack, {
            xPercent: -50,
            ease: "none",
            duration: marqueeSpeed,
            repeat: -1
        });

        // Pause marquee on hover over the entire section wrapper
        certTrackWrapper.addEventListener("mouseenter", () => {
            if (tickerTween) tickerTween.pause();
        });

        certTrackWrapper.addEventListener("mouseleave", () => {
            if (tickerTween) tickerTween.play();
        });
    }

    // ==========================================================================
    // 11. Certificates Lightbox Modal Overlay (Large previews & Zoom/Navigation)
    // ==========================================================================
    const certCards = document.querySelectorAll(".cert-card-float");
    const certModal = document.getElementById("cert-modal");
    const certModalIframe = document.getElementById("cert-modal-iframe");
    const certModalTitleText = document.getElementById("cert-modal-title-text");
    const certModalDownload = document.getElementById("cert-modal-download");
    
    const btnCertClose = certModal ? certModal.querySelector(".btn-cert-close") : null;
    const btnCertPrev = certModal ? certModal.querySelector(".cert-nav-prev") : null;
    const btnCertNext = certModal ? certModal.querySelector(".cert-nav-next") : null;
    const btnCertZoomIn = certModal ? certModal.querySelector(".btn-cert-zoom-in") : null;
    const btnCertZoomOut = certModal ? certModal.querySelector(".btn-cert-zoom-out") : null;
    
    let currentCertIndex = 0;
    let currentZoom = 1;
    const certificatesList = [];

    if (certCards.length > 0) {
        // Collect certificates data from DOM (only first 5 unique entries)
        const uniqueCount = certCards.length / 2; // since cards are duplicated for marquee ticker
        for (let i = 0; i < uniqueCount; i++) {
            const card = certCards[i];
            const linkEl = card.querySelector(".btn-cert-overlay");
            const titleEl = card.querySelector(".cert-title");
            const orgEl = card.querySelector(".cert-org");
            
            certificatesList.push({
                url: linkEl ? linkEl.getAttribute("href") : "",
                title: titleEl ? titleEl.textContent : "Certificate",
                org: orgEl ? orgEl.textContent : ""
            });
        }

        // Attach click listeners to all cards (both original and duplicate sets)
        certCards.forEach((card, index) => {
            const tiltCard = card.querySelector(".cert-card-tilt");
            if (tiltCard) {
                tiltCard.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Open matching index (modulo unique count so duplicates open same file)
                    openCertModal(index % uniqueCount);
                });
            }
        });
    }

    function openCertModal(index) {
        currentCertIndex = index;
        currentZoom = 1;
        
        updateModalContent();
        
        if (certModal) {
            certModal.classList.add("active");
            document.body.style.overflow = "hidden"; // Lock background scroll
        }
    }

    function updateModalContent() {
        const cert = certificatesList[currentCertIndex];
        if (!cert) return;
        
        if (certModalIframe) {
            certModalIframe.src = cert.url;
            certModalIframe.style.transform = `scale(${currentZoom})`;
        }
        
        if (certModalTitleText) {
            certModalTitleText.innerHTML = `<i class="fas fa-certificate"></i> ${cert.title} <span style="font-size: 0.85rem; opacity: 0.7; font-weight: 400; margin-left: 8px;">(${cert.org})</span>`;
        }
        
        if (certModalDownload) {
            certModalDownload.href = cert.url;
        }
    }

    function closeCertModal() {
        if (certModal) {
            certModal.classList.remove("active");
            document.body.style.overflow = ""; // Restore background scroll
        }
        if (certModalIframe) {
            certModalIframe.src = ""; // Clear iframe to stop background rendering
        }
    }

    if (btnCertClose) {
        btnCertClose.addEventListener("click", (e) => {
            e.stopPropagation();
            closeCertModal();
        });
    }

    if (certModal) {
        certModal.addEventListener("click", (e) => {
            // Close if clicking direct dark background mask
            if (e.target === certModal) {
                closeCertModal();
            }
        });
    }

    if (btnCertPrev) {
        btnCertPrev.addEventListener("click", (e) => {
            e.stopPropagation();
            currentCertIndex = (currentCertIndex - 1 + certificatesList.length) % certificatesList.length;
            currentZoom = 1;
            updateModalContent();
        });
    }

    if (btnCertNext) {
        btnCertNext.addEventListener("click", (e) => {
            e.stopPropagation();
            currentCertIndex = (currentCertIndex + 1) % certificatesList.length;
            currentZoom = 1;
            updateModalContent();
        });
    }

    if (btnCertZoomIn) {
        btnCertZoomIn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentZoom < 3) {
                currentZoom += 0.25;
                if (certModalIframe) {
                    certModalIframe.style.transform = `scale(${currentZoom})`;
                }
            }
        });
    }

    if (btnCertZoomOut) {
        btnCertZoomOut.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentZoom > 0.5) {
                currentZoom -= 0.25;
                if (certModalIframe) {
                    certModalIframe.style.transform = `scale(${currentZoom})`;
                }
            }
        });
    }

    // Keyboard Esc close and Arrow keys navigation
    window.addEventListener("keydown", (e) => {
        if (certModal && certModal.classList.contains("active")) {
            if (e.key === "Escape") {
                closeCertModal();
            } else if (e.key === "ArrowLeft" && btnCertPrev) {
                btnCertPrev.click();
            } else if (e.key === "ArrowRight" && btnCertNext) {
                btnCertNext.click();
            }
        }
    });

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
            if (modalIframe) modalIframe.src = "Final resume.pdf";
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
    const profileStack = document.querySelector(".profile-card-stack");
    const profileFrame = document.querySelector(".profile-frame");
    if (profileStack && profileFrame) {
        let floatTimeline = null;

        // Custom Entrance Animation using GSAP
        window.playProfileEntrance = function() {
            gsap.to(profileStack, {
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

        // Gentle Floating Loop (floats the entire stack together)
        function startProfileFloating() {
            floatTimeline = gsap.timeline({ repeat: -1 });
            floatTimeline.to(profileStack, {
                y: -7, // float up by 7px
                duration: 3,
                ease: "power1.inOut"
            }).to(profileStack, {
                y: 7, // float down by 7px
                duration: 3,
                ease: "power1.inOut"
            });
        }

        // 3D Tilt and Purple Specular Glow on Hover (tilts the top card individually)
        function initProfileHover() {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (isTouchDevice) return; // Disable hover tilts on touch devices

            profileFrame.addEventListener("mouseenter", () => {
                if (floatTimeline) {
                    floatTimeline.pause(); // Pause floating animation
                }

                gsap.to(profileFrame, {
                    scale: 1.03,
                    boxShadow: "0 20px 50px rgba(143, 67, 255, 0.35)", // purple glow backdrop
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
                    rotateX: -normY * 15,
                    rotateY: normX * 15,
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
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)", // reset to default shadow
                    duration: 0.6,
                    ease: "power3.out"
                });
            });
        }
    }

    // ==========================================================================
    // 13. Animated 3D Realistic Earth Globe (Three.js)
    // ==========================================================================
    const canvas = document.getElementById("footer-globe-canvas");
    if (canvas && typeof THREE !== 'undefined') {
        const width = 70;
        const height = 70;
        
        const scene = new THREE.Scene();
        
        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 4.2;
        
        // Renderer with transparent background (alpha: true)
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio ? Math.min(window.devicePixelRatio, 2) : 1);
        
        // Group for rotation
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);
        
        // Lighting for realistic textures
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(5, 3, 5);
        scene.add(dirLight);
        
        // Load Realistic Earth Texture with CORS
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = 'anonymous';
        
        const earthTexture = textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            () => {
                renderer.render(scene, camera);
            }
        );
        
        // Earth geometry and material
        const geometry = new THREE.SphereGeometry(1.5, 48, 48);
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            shininess: 15,
            specular: new THREE.Color(0x222222)
        });
        const earthMesh = new THREE.Mesh(geometry, material);
        globeGroup.add(earthMesh);
        
        // Atmospheric Blue Glow Shader Mesh (Rendered slightly larger and behind)
        const glowGeometry = new THREE.SphereGeometry(1.56, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.0, 0.7, 1.0, 1.0) * intensity * 0.45;
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glowMesh);
        
        // Slow auto-rotation: 1 full rotation every 20s (approx 0.0052 rad/frame at 60 FPS)
        let autoRotate = true;
        const rotationSpeed = 0.0052;
        
        // Drag controls variables
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        const container = document.querySelector(".footer-globe-container");
        
        if (container) {
            // Mouse Drag Rotation
            container.addEventListener("mousedown", (e) => {
                isDragging = true;
                autoRotate = false;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            });
            
            window.addEventListener("mousemove", (e) => {
                if (!isDragging) return;
                
                const deltaMove = {
                    x: e.clientX - previousMousePosition.x,
                    y: e.clientY - previousMousePosition.y
                };
                
                globeGroup.rotation.y += deltaMove.x * 0.007;
                globeGroup.rotation.x += deltaMove.y * 0.007;
                
                previousMousePosition = { x: e.clientX, y: e.clientY };
            });
            
            window.addEventListener("mouseup", () => {
                if (isDragging) {
                    isDragging = false;
                    setTimeout(() => {
                        if (!isDragging) autoRotate = true;
                    }, 2000);
                }
            });
            
            // Touch Drag Support for Mobile
            container.addEventListener("touchstart", (e) => {
                isDragging = true;
                autoRotate = false;
                const touch = e.touches[0];
                previousMousePosition = { x: touch.clientX, y: touch.clientY };
            });
            
            window.addEventListener("touchmove", (e) => {
                if (!isDragging) return;
                const touch = e.touches[0];
                
                const deltaMove = {
                    x: touch.clientX - previousMousePosition.x,
                    y: touch.clientY - previousMousePosition.y
                };
                
                globeGroup.rotation.y += deltaMove.x * 0.008;
                globeGroup.rotation.x += deltaMove.y * 0.008;
                
                previousMousePosition = { x: touch.clientX, y: touch.clientY };
            }, { passive: true });
            
            window.addEventListener("touchend", () => {
                isDragging = false;
                setTimeout(() => {
                    if (!isDragging) autoRotate = true;
                }, 2000);
            });

            // Mouse Wheel Zoom
            container.addEventListener("wheel", (e) => {
                e.preventDefault();
                camera.position.z += e.deltaY * 0.004;
                camera.position.z = Math.max(2.8, Math.min(7.0, camera.position.z));
            }, { passive: false });
        }
        
        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (autoRotate) {
                globeGroup.rotation.y += rotationSpeed;
            }
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle window resizing
        window.addEventListener("resize", () => {
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    }

});
