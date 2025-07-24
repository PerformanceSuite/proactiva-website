// PROACTIVA Shared Scripts - Common functionality used across all pages

/**
 * Unified Modal Management System
 * Handles all modal operations consistently across the site
 */
class ProactivaModal {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    init() {
        // Close modals on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.hide(this.activeModal);
            }
        });

        // Prevent body scroll when modal is open
        this.preventBodyScroll();
    }

    show(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID "${modalId}" not found`);
            return;
        }

        // Hide any currently active modal
        if (this.activeModal && this.activeModal !== modalId) {
            this.hide(this.activeModal);
        }

        modal.classList.add('active');
        modal.style.display = 'flex';
        this.activeModal = modalId;
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        const firstFocusable = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        console.log(`Modal "${modalId}" opened`);
    }

    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID "${modalId}" not found`);
            return;
        }

        modal.classList.remove('active');
        modal.style.display = 'none';
        this.activeModal = null;
        document.body.style.overflow = '';

        console.log(`Modal "${modalId}" closed`);
    }

    resetLoginModal() {
        const loginForm = document.getElementById('loginForm');
        const adminDashboard = document.getElementById('adminDashboard');
        const loginError = document.getElementById('loginError');
        const loginUsername = document.getElementById('loginUsername');
        const loginPassword = document.getElementById('loginPassword');
        const loginModal = document.getElementById('loginModal');

        if (loginForm) loginForm.style.display = 'block';
        if (adminDashboard) adminDashboard.style.display = 'none';
        if (loginError) loginError.style.display = 'none';
        if (loginUsername) loginUsername.value = '';
        if (loginPassword) loginPassword.value = '';
        if (loginModal) loginModal.classList.remove('dashboard-mode');
    }

    showSignupForm() {
        const modalContent = document.getElementById('modalContent');
        const signupForm = document.getElementById('signupForm');
        const successMsg = document.getElementById('successMessage');
        const errorMsg = document.getElementById('errorMessage');

        if (modalContent) modalContent.style.display = 'none';
        if (signupForm) signupForm.style.display = 'block';
        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';

        // Focus first input
        setTimeout(() => {
            const nameInput = document.getElementById('name');
            if (nameInput) nameInput.focus();
        }, 100);
    }

    preventBodyScroll() {
        // Prevent background scrolling on iOS when modal is open
        document.addEventListener('touchmove', (e) => {
            if (this.activeModal && !e.target.closest('.access-modal')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

/**
 * Unified Form Management System
 * Handles form validation, submission, and error handling
 */
class ProactivaFormHandler {
    constructor() {
        this.submissionEndpoint = 'proactivaSubmissions'; // localStorage key
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Input sanitization
    sanitizeInput(input) {
        return input.trim().replace(/[<>]/g, '');
    }

    // Validate form data
    validateForm(formData, requiredFields = []) {
        const errors = {};

        // Check required fields
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
        });

        // Email validation
        if (formData.email && !this.isValidEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Display form errors
    showErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.style.display = 'none';
        });

        // Show new errors
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${field}Error`);
            if (errorElement) {
                errorElement.textContent = errors[field];
                errorElement.style.display = 'block';
            }
        });
    }

    // Submit form data
    async submitForm(formData, formType = 'contact') {
        try {
            const submissionData = {
                ...formData,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'Direct',
                formType: formType,
                id: Date.now().toString()
            };

            // Get existing submissions
            const existingSubmissions = JSON.parse(localStorage.getItem(this.submissionEndpoint) || '[]');
            
            // Add new submission
            existingSubmissions.push(submissionData);
            
            // Save to localStorage
            localStorage.setItem(this.submissionEndpoint, JSON.stringify(existingSubmissions));

            console.log('Form submitted successfully:', submissionData);
            return { success: true, data: submissionData };

        } catch (error) {
            console.error('Form submission error:', error);
            return { success: false, error: error.message };
        }
    }

    // Reset form
    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            
            // Clear errors
            form.querySelectorAll('.form-error').forEach(error => {
                error.style.display = 'none';
            });

            // Remove any success/error states
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error', 'success');
            });
        }
    }

    // Show success message
    showSuccess(message, containerId = 'successMessage') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="success-message">
                    <div style="font-size: 48px; color: #28a745; margin-bottom: 15px;">✓</div>
                    <h3 style="color: #155724; margin-bottom: 10px;">Success!</h3>
                    <p style="margin-bottom: 20px;">${message}</p>
                    <button class="btn btn--primary" onclick="window.proactivaModal.hide('${this.getCurrentModal()}')">
                        ← Back to PROACTIVA
                    </button>
                </div>
            `;
            container.style.display = 'block';
        }
    }

    // Get current active modal ID
    getCurrentModal() {
        return window.proactivaModal?.activeModal || '';
    }
}

/**
 * Mobile Menu Management
 * Handles mobile navigation toggle functionality
 */
class ProactivaMobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Handle clicks outside menu to close
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (this.isOpen && mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                this.close();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            this.isOpen = true;
        }

        // Animate hamburger to X
        if (mobileMenuBtn) {
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            }
        }

        console.log('Mobile menu opened');
    }

    close() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            this.isOpen = false;
        }

        // Reset hamburger animation
        if (mobileMenuBtn) {
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }

        console.log('Mobile menu closed');
    }
}

/**
 * Login Handler with Rate Limiting
 * Secure login handling with attempt limiting
 */
class ProactivaLoginHandler {
    constructor() {
        this.attemptCount = 0;
        this.lastAttempt = 0;
        this.maxAttempts = 5;
        this.lockoutDuration = 5 * 60 * 1000; // 5 minutes
    }

    canAttemptLogin() {
        const now = Date.now();
        
        // Reset attempts if lockout period has passed
        if (now - this.lastAttempt > this.lockoutDuration) {
            this.attemptCount = 0;
        }

        return this.attemptCount < this.maxAttempts;
    }

    recordAttempt() {
        this.attemptCount++;
        this.lastAttempt = Date.now();
    }

    getRemainingLockoutTime() {
        const now = Date.now();
        const timeSinceLastAttempt = now - this.lastAttempt;
        const remainingTime = this.lockoutDuration - timeSinceLastAttempt;
        return Math.max(0, remainingTime);
    }

    handleLogin(event) {
        event.preventDefault();

        if (!this.canAttemptLogin()) {
            const remainingTime = Math.ceil(this.getRemainingLockoutTime() / 1000 / 60);
            this.showError(`Too many failed attempts. Please try again in ${remainingTime} minutes.`);
            return;
        }

        const username = document.getElementById('loginUsername')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!username || !password) {
            this.showError('Please enter both username and password.');
            return;
        }

        // Simple credential check (in production, this would be server-side)
        if (username === 'admin' && password === 'proactiva2025') {
            this.handleSuccessfulLogin();
        } else {
            this.handleFailedLogin();
        }
    }

    handleSuccessfulLogin() {
        // Reset attempt counter
        this.attemptCount = 0;

        // Show dashboard
        const loginForm = document.getElementById('loginForm');
        const adminDashboard = document.getElementById('adminDashboard');
        const loginError = document.getElementById('loginError');
        const loginModal = document.getElementById('loginModal');

        if (loginForm) loginForm.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        if (loginError) loginError.style.display = 'none';
        if (loginModal) loginModal.classList.add('dashboard-mode');

        // Load dashboard data if function exists
        if (typeof loadSubmissionsData === 'function') {
            loadSubmissionsData();
        }

        console.log('Admin login successful');
    }

    handleFailedLogin() {
        this.recordAttempt();
        
        const passwordInput = document.getElementById('loginPassword');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }

        this.showError('Invalid credentials. Please try again.');
        console.warn('Failed login attempt');
    }

    showError(message) {
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
        }
    }

    logout() {
        // Reset attempt counter
        this.attemptCount = 0;

        // Remove dashboard mode
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.remove('dashboard-mode');
        }

        // Reset modal to login state
        if (window.proactivaModal) {
            window.proactivaModal.resetLoginModal();
            window.proactivaModal.hide('loginModal');
        }

        console.log('Admin logged out');
    }
}

/**
 * Utility Functions
 * Common helper functions used across the site
 */
class ProactivaUtils {
    // Debounce function for performance
    static debounce(func, wait) {
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

    // Format date for display
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format time for display
    static formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Escape HTML to prevent XSS
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Generate unique ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Smooth scroll to element
    static scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

/**
 * Initialize PROACTIVA Core Systems
 * Sets up all shared functionality when DOM is ready
 */
function initializeProactiva() {
    // Initialize core systems
    window.proactivaModal = new ProactivaModal();
    window.proactivaFormHandler = new ProactivaFormHandler();
    window.proactivaMobileMenu = new ProactivaMobileMenu();
    window.proactivaLoginHandler = new ProactivaLoginHandler();

    // Global convenience functions for backward compatibility
    window.showAccessModal = () => window.proactivaModal.show('accessModal');
    window.showSignupForm = () => {
        window.proactivaModal.show('accessModal');
        window.proactivaModal.showSignupForm();
    };
    window.hideAccessModal = () => window.proactivaModal.hide('accessModal');
    window.showLoginModal = () => {
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.style.display = 'none';
        }
        window.proactivaModal.show('loginModal');
    };
    window.hideLoginModal = () => {
        const loginModal = document.getElementById('loginModal');
        if (loginModal && loginModal.classList.contains('dashboard-mode')) {
            window.proactivaLoginHandler.logout();
        } else {
            window.proactivaModal.hide('loginModal');
        }
    };
    window.showContactModal = () => window.proactivaModal.show('contactModal');
    window.hideContactModal = () => window.proactivaModal.hide('contactModal');
    window.toggleMobileMenu = () => window.proactivaMobileMenu.toggle();
    window.handleLogin = (event) => window.proactivaLoginHandler.handleLogin(event);
    window.logout = () => window.proactivaLoginHandler.logout();

    // Add event listeners for unobtrusive JavaScript
    document.querySelectorAll('.contact-link').forEach(btn => btn.addEventListener('click', () => window.showContactModal()));
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', () => window.proactivaModal.hide(btn.closest('.access-overlay, .contact-overlay').id)));
    document.querySelectorAll('.login-btn').forEach(btn => btn.addEventListener('click', () => window.showLoginModal()));
    document.querySelectorAll('.nav-link[onclick*="showAccessModal"]').forEach(btn => btn.addEventListener('click', () => window.showAccessModal()));
    document.querySelectorAll('.cta-button[onclick*="showAccessModal"]').forEach(btn => btn.addEventListener('click', () => window.showAccessModal()));
    document.querySelectorAll('.research-card').forEach(card => card.addEventListener('click', () => window.showAccessModal()));
    document.querySelectorAll('#contactForm').forEach(form => form.addEventListener('submit', (e) => handleContactSubmit(e)));
    document.querySelectorAll('#accessForm').forEach(form => form.addEventListener('submit', (e) => handleFormSubmit(e)));
    document.querySelectorAll('.mobile-menu-btn').forEach(btn => btn.addEventListener('click', () => window.toggleMobileMenu()));
    document.querySelectorAll('.nav-link[onclick*="scrollToSection"]').forEach(btn => btn.addEventListener('click', () => scrollToSection('research')));
    document.querySelectorAll('.mobile-menu-link[onclick*="scrollToSection"]').forEach(btn => btn.addEventListener('click', () => { scrollToSection('research'); window.toggleMobileMenu(); }));
    document.querySelectorAll('.mobile-menu-link[onclick*="showAccessModal"]').forEach(btn => btn.addEventListener('click', () => { window.showAccessModal(); window.toggleMobileMenu(); }));
    document.querySelectorAll('.mobile-login-btn').forEach(btn => btn.addEventListener('click', () => { window.showLoginModal(); window.toggleMobileMenu(); }));
    document.querySelectorAll('#signupBackBtn').forEach(btn => btn.addEventListener('click', () => {
        const modalContent = document.getElementById('modalContent');
        const signupForm = document.getElementById('signupForm');
        if(modalContent) modalContent.style.display = 'block';
        if(signupForm) signupForm.style.display = 'none';
    }));


    console.log('PROACTIVA core systems initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProactiva);
} else {
    initializeProactiva();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProactivaModal,
        ProactivaFormHandler,
        ProactivaMobileMenu,
        ProactivaLoginHandler,
        ProactivaUtils
    };
}

// Legacy functions for research pages
function scrollToSection(sectionId) {
    ProactivaUtils.scrollToElement(sectionId, 80); // 80px offset for header
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const formData = {
        name: form.name.value,
        email: form.email.value,
        organization: form.organization.value,
        role: form.role.value
    };

    const validation = window.proactivaFormHandler.validateForm(formData, ['name', 'email']);

    if (!validation.isValid) {
        window.proactivaFormHandler.showErrors(validation.errors);
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }

    const result = await window.proactivaFormHandler.submitForm(formData, 'accessRequest');

    if (result.success) {
        window.proactivaFormHandler.showSuccess('We will review your request and contact you shortly.', 'signupForm');
    } else {
        window.proactivaFormHandler.showErrors({ form: result.error });
    }

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
    }
}

async function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const formData = {
        name: form.contactName.value,
        email: form.contactEmail.value,
        organization: form.contactOrganization.value,
        subject: form.contactSubject.value,
        message: form.contactMessage.value
    };

    const validation = window.proactivaFormHandler.validateForm(formData, ['name', 'email', 'message']);

    if (!validation.isValid) {
        window.proactivaFormHandler.showErrors(validation.errors);
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    const result = await window.proactivaFormHandler.submitForm(formData, 'contact');

    if (result.success) {
        window.proactivaFormHandler.showSuccess('Thank you for your message! We will be in touch shortly.', 'contactForm');
    } else {
        window.proactivaFormHandler.showErrors({ form: result.error });
    }

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}
