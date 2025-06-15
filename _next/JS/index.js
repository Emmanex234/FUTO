        // Initialize Supabase client
        const supabaseUrl = 'YOUR_SUPABASE_URL';
        const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        
        // Note: Replace with your actual Supabase credentials
        let supabase;
        try {
            supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        } catch (error) {
            console.log('Supabase not configured. Using mock authentication for demo.');
        }

        // Modal functions
        function openModal(type) {
            const modalId = type === 'login' ? 'loginModal' : 'signupModal';
            document.getElementById(modalId).style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.body.style.overflow = 'auto';
            clearMessages();
        }

        function switchModal(fromModal, toModal) {
            document.getElementById(fromModal).style.display = 'none';
            document.getElementById(toModal).style.display = 'block';
            clearMessages();
        }

        function clearMessages() {
            const messages = document.querySelectorAll('.error-message, .success-message');
            messages.forEach(msg => msg.style.display = 'none');
        }

        function showMessage(elementId, message, isError = true) {
            const element = document.getElementById(elementId);
            element.textContent = message;
            element.style.display = 'block';
            
            // Hide other message types
            const otherType = isError ? elementId.replace('Error', 'Success') : elementId.replace('Success', 'Error');
            const otherElement = document.getElementById(otherType);
            if (otherElement) otherElement.style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    clearMessages();
                }
            });
        }

        // Login form handler
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                if (supabase) {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                    if (error) {
                        showMessage('loginError', error.message, true);
                    } else {
                        showMessage('loginSuccess', 'Login successful! Redirecting...', false);
                        setTimeout(() => {
                            closeModal('loginModal');
                            // Redirect to dashboard or main app
                            alert('Login successful! Welcome to FUTO Clearance Portal.');
                        }, 1500);
                    }
                } else {
                    // Mock authentication for demo
                    if (email && password) {
                        showMessage('loginSuccess', 'Login successful! (Demo mode)', false);
                        setTimeout(() => {
                            closeModal('loginModal');
                            alert('Demo login successful! In production, this would redirect to your dashboard.');
                        }, 1500);
                    } else {
                        showMessage('loginError', 'Please fill in all fields', true);
                    }
                }
            } catch (error) {
                showMessage('loginError', 'An error occurred during login', true);
            }
        });

        // Signup form handler
        document.getElementById('signupForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showMessage('signupError', 'Passwords do not match', true);
                return;
            }

            if (password.length < 6) {
                showMessage('signupError', 'Password must be at least 6 characters', true);
                return;
            }

            try {
                if (supabase) {
                    const { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: {
                                full_name: name
                            }
                        }
                    });

                    if (error) {
                        showMessage('signupError', error.message, true);
                    } else {
                        showMessage('signupSuccess', 'Account created successfully! Please check your email to verify your account.', false);
                        setTimeout(() => {
                            switchModal('signupModal', 'loginModal');
                        }, 2000);
                    }
                } else {
                    // Mock authentication for demo
                    if (name && email && password) {
                        showMessage('signupSuccess', 'Account created successfully! (Demo mode)', false);
                        setTimeout(() => {
                            switchModal('signupModal', 'loginModal');
                        }, 1500);
                    } else {
                        showMessage('signupError', 'Please fill in all fields', true);
                    }
                }
            } catch (error) {
                showMessage('signupError', 'An error occurred during signup', true);
            }
        });

        // Add smooth scrolling and enhanced animations
        document.addEventListener('DOMContentLoaded', function() {
            // Add stagger animation to elements
            const animatedElements = document.querySelectorAll('.hero > *');
            animatedElements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.2}s`;
            });
        });
 function toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        document.body.addEventListener('click', closeMenuOnClickOutside, { once: true });
    }
    function closeMenuOnClickOutside(e) {
        const menu = document.getElementById('mobileMenu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.style.display = 'none';
        }
    }


    // Clearance Requirements Animation
let currentRequirement = 0;
const requirements = document.querySelectorAll('.requirement-item');
const dots = document.querySelectorAll('.dot');
const totalRequirements = requirements.length;

function showRequirement(index) {
    // Hide all requirements
    requirements.forEach(req => req.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current requirement
    requirements[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextRequirement() {
    currentRequirement = (currentRequirement + 1) % totalRequirements;
    showRequirement(currentRequirement);
}

// Auto-cycle through requirements
let requirementInterval = setInterval(nextRequirement, 3000);

// Add click handlers for dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentRequirement = index;
        showRequirement(currentRequirement);
        
        // Reset interval
        clearInterval(requirementInterval);
        requirementInterval = setInterval(nextRequirement, 3000);
    });
});

// Pause animation on hover
const requirementsSection = document.querySelector('.clearance-requirements');
// On page load and reload, show the first requirement
showRequirement(0);

requirementsSection.addEventListener('mouseenter', () => {
    clearInterval(requirementInterval);
});

requirementsSection.addEventListener('mouseleave', () => {
    requirementInterval = setInterval(nextRequirement, 3000);
});