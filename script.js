// Stripe Configuration
// IMPORTANT: Replace this with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Rxv1P3ULNM0g6zORE6hf7O4l67tQwmP3CpfczsDVhHM3emn3HB1TdpD7wCty9we6oA1EVIi3WsGqsCZnalww9I900eSJ9K6al'; // Replace with your real key from Stripe dashboard
let stripe = null;
let cardElement = null;

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Set minimum date for date inputs to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });

    // Demo Form Handler
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleDemoFormSubmission(this);
        });
    }

    // Initialize Stripe
    initializeStripe();

    // Registration Form Handler
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistrationFormSubmission(this);
        });

        // Update pricing when selections change
        setupPricingCalculator();
        
        // Handle payment method switching
        setupPaymentMethodSwitching();
    }

    // Form validation
    setupFormValidation();

    // Smooth scrolling for anchor links
    setupSmoothScrolling();

    // Animation on scroll
    setupScrollAnimations();
    
    // Setup step navigation buttons
    setupStepNavigation();
});

// Setup step navigation event listeners
function setupStepNavigation() {
    // Next step buttons
    const nextStep1Btn = document.getElementById('nextStep1');
    const nextStep2Btn = document.getElementById('nextStep2');
    
    // Previous step buttons
    const prevStep1Btn = document.getElementById('prevStep1');
    const prevStep2Btn = document.getElementById('prevStep2');
    
    if (nextStep1Btn) {
        nextStep1Btn.addEventListener('click', () => nextStep(2));
    }
    
    if (nextStep2Btn) {
        nextStep2Btn.addEventListener('click', () => nextStep(3));
    }
    
    if (prevStep1Btn) {
        prevStep1Btn.addEventListener('click', () => prevStep(1));
    }
    
    if (prevStep2Btn) {
        prevStep2Btn.addEventListener('click', () => prevStep(2));
    }
}

// Multi-step Registration Form
let currentStep = 1;
const totalSteps = 3;

function nextStep(step) {
    console.log('NextStep called:', currentStep, '->', step);
    const isValid = validateCurrentStep(currentStep);
    console.log('Validation result:', isValid);
    
    if (isValid) {
        showStep(step);
        currentStep = step;
        console.log('Step advanced to:', step);
    } else {
        console.log('Validation failed for step:', currentStep);
    }
}

function prevStep(step) {
    showStep(step);
    currentStep = step;
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepIndicator, index) => {
        stepIndicator.classList.remove('active');
        if (index + 1 === step) {
            stepIndicator.classList.add('active');
        }
    });

    // Update pricing display if on step 3
    if (step === 3) {
        updatePricingDisplay();
    }
}

function validateCurrentStep(step) {
    console.log('Validating step:', step);
    const stepElement = document.getElementById(`step${step}`);
    if (!stepElement) {
        console.log('Step element not found:', `step${step}`);
        return true;
    }

    const requiredFields = stepElement.querySelectorAll('[required]');
    console.log('Required fields found:', requiredFields.length);
    let isValid = true;
    
    requiredFields.forEach((field, index) => {
        const fieldValid = validateField(field);
        console.log(`Field ${index} (${field.name || field.id}):`, field.value, 'Valid:', fieldValid);
        if (!fieldValid) {
            isValid = false;
        }
    });

    // Special validation for step 2 (subscription selection)
    if (step === 2) {
        const gradeLevel = document.querySelector('input[name="gradeLevel"]:checked');
        
        if (!gradeLevel) {
            showError('Please select a grade level for your monthly subscription');
            isValid = false;
        }
    }
    
    // Special validation for step 3 (schedule & payment)
    if (step === 3) {
        // No additional validation needed for step 3
        // Form validation handles required fields automatically
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        const phoneRegex = /^[\+]?[\d]{10,15}$/;
        if (!phoneRegex.test(cleanPhone)) {
            errorMessage = 'Please enter a valid phone number (10-15 digits)';
            isValid = false;
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error-color)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showSuccess(message) {
    // You can implement a toast notification or modal here
    alert(message); // Simple implementation
}

// Pricing Calculator
function setupPricingCalculator() {
    // Listen for changes in grade level selection
    document.querySelectorAll('input[name="gradeLevel"]').forEach(input => {
        input.addEventListener('change', updatePricingDisplay);
    });
    
    document.querySelectorAll('input[name="specialty"]').forEach(input => {
        input.addEventListener('change', updatePricingDisplay);
    });
}

function updatePricingDisplay() {
    const selectedGradeLevel = document.querySelector('input[name="gradeLevel"]:checked');
    const selectedSpecialties = document.querySelectorAll('input[name="specialty"]:checked');
    
    let monthlyPrice = 0;
    let gradeLevelName = '';
    
    // Monthly subscription prices (in INR) for different grade levels
    const monthlySubscriptionPrices = {
        'elementary': 3500,
        'middle': 4500,
        'high': 5500
    };
    
    if (selectedGradeLevel) {
        monthlyPrice = monthlySubscriptionPrices[selectedGradeLevel.value];
        gradeLevelName = selectedGradeLevel.nextElementSibling.querySelector('h4').textContent;
        
        // Update display elements
        updateDisplayElement('selectedGradeLevelDisplay', gradeLevelName);
        updateDisplayElement('specialtyFeesDisplay', 'Included'); // Specialties included in subscription
        updateDisplayElement('totalAmountDisplay', `₹${monthlyPrice}/month`);
    }
}

function updateDisplayElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Form Submission Handlers
function handleDemoFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    console.log('Demo form data:', data);
    
    // Show success message
    showSuccess('Thank you! Your demo lesson has been scheduled. You will receive a confirmation email shortly.');
    
    // Reset form
    form.reset();
    
    // Send to backend API
    fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(result => {
          if (result.success) {
              showSuccess(result.message);
              form.reset();
          } else {
              showError(result.message || 'Error booking demo. Please try again.');
          }
      })
      .catch(error => {
          console.error('Demo booking error:', error);
          showError('Network error. Please check your connection and try again.');
      });
}

async function handleRegistrationFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Get all selected specialties
    const specialties = [];
    document.querySelectorAll('input[name="specialty"]:checked').forEach(input => {
        specialties.push(input.value);
    });
    data.specialties = specialties;
    
    const paymentMethod = data.paymentMethod;
    const totalAmount = calculateTotalAmount();
    
    // Disable submit button during processing
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        if (paymentMethod === 'card') {
            // Process Stripe payment
            await processStripePayment(data, totalAmount);
        } else if (paymentMethod === 'upi') {
            // Process UPI payment
            await processUPIPayment(data, totalAmount);
        } else if (paymentMethod === 'bank') {
            // Handle bank transfer
            await processBankTransfer(data, totalAmount);
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        showError(error.message || 'Payment processing failed. Please try again.');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

async function processStripePayment(registrationData, amount) {
    if (!stripe || !cardElement) {
        throw new Error('Stripe is not properly initialized. Please refresh the page and try again.');
    }
    
    // Create payment method with Stripe
    const {error: paymentMethodError, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: `${registrationData.firstName} ${registrationData.lastName}`,
            email: registrationData.email,
        },
    });

    if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
    }

    // Step 1: Create subscription setup intent on server
    console.log('Creating subscription for:', registrationData);
    console.log('Grade Level:', registrationData.gradeLevel);
    
    const createSubscriptionResponse = await fetch('/api/create-subscription-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            registrationData
        })
    });
    
    if (!createSubscriptionResponse.ok) {
        const errorData = await createSubscriptionResponse.json();
        throw new Error(errorData.message || 'Failed to create subscription setup');
    }
    
    const { setupIntent: setupIntentData, customer: customerData, priceId } = await createSubscriptionResponse.json();
    const clientSecret = setupIntentData.client_secret;
    const customerId = customerData.id;
    
    // Step 2: Confirm setup intent with Stripe
    const {error: confirmError, setupIntent} = await stripe.confirmCardSetup(clientSecret, {
        payment_method: paymentMethod.id
    });
    
    if (confirmError) {
        throw new Error(confirmError.message);
    }
    
    // Step 3: Confirm subscription creation with backend
    const confirmResponse = await fetch('/api/confirm-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            setupIntentId: setupIntent.id,
            paymentMethodId: paymentMethod.id,
            customerId: customerId,
            priceId: priceId,
            registrationData
        })
    });
    
    const confirmResult = await confirmResponse.json();
    if (confirmResult.success) {
        showPaymentSuccess(`🎉 Registration Successful! 
        
Your French exam preparation subscription is now active! Here's what happens next:

✅ Confirmation email sent to ${registrationData.email} (check your inbox!)
✅ Student Portal Login: Use your email + subscription ID from the email
✅ Sandy will contact you within 24 hours to schedule your first lesson
✅ Monthly subscription: ₹${registrationData.gradeLevel === 'elementary' ? '3,500' : registrationData.gradeLevel === 'middle' ? '4,500' : '5,500'}/month
✅ Access to 4 classes per month + exam preparation materials

Questions? WhatsApp us at +91 98765 43210`);
        document.getElementById('registrationForm').reset();
        showStep(1);
        currentStep = 1;
    } else {
        throw new Error(confirmResult.message || 'Subscription creation failed');
    }
}

async function processUPIPayment(registrationData, amount) {
    // Create UPI payment intent on server
    console.log('Creating UPI payment intent for:', registrationData);
    console.log('Amount:', amount);
    
    const createPaymentResponse = await fetch('/api/create-upi-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            registrationData,
            amount: Math.round(amount)
        })
    });
    
    if (!createPaymentResponse.ok) {
        const errorData = await createPaymentResponse.json();
        throw new Error(errorData.message || 'Failed to create UPI payment intent');
    }
    
    const { clientSecret, redirectUrl } = await createPaymentResponse.json();
    
    if (redirectUrl) {
        // For UPI, Stripe provides a redirect URL to the UPI app
        window.location.href = redirectUrl;
    } else {
        // Fallback: use Stripe's confirmPayment for UPI
        const {error} = await stripe.confirmPayment({
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success.html`,
                payment_method_data: {
                    type: 'upi'
                }
            }
        });
        
        if (error) {
            throw new Error(error.message);
        }
    }
}

async function processBankTransfer(registrationData, amount) {
    // Send bank transfer registration to server
    console.log('Bank transfer registration:', registrationData);
    console.log('Amount for bank transfer:', amount);
    
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...registrationData,
            paymentMethod: 'bank',
            amount: amount
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bank transfer registration failed');
    }
    
    const result = await response.json();
    if (result.success) {
        showPaymentSuccess(`🎉 Registration Successful! 

Your French exam preparation registration is complete! Here's what happens next:

✅ Bank transfer instructions sent to ${registrationData.email}
✅ Monthly subscription amount: ₹${amount}
✅ Payment deadline: 48 hours to secure your slot
✅ Sandy will contact you after payment confirmation

Questions? WhatsApp us at +91 98765 43210`);
        document.getElementById('registrationForm').reset();
        showStep(1);
        currentStep = 1;
    } else {
        throw new Error(result.message || 'Bank transfer registration failed');
    }
}

// Form Validation Setup
function setupFormValidation() {
    // Add real-time validation to form fields
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') || this.value.trim()) {
                validateField(this);
            }
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
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
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .benefit-card, .testimonial-card, .level-card, .format-card, .package-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility Functions
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

// Stripe Initialization
function initializeStripe() {
    try {
        if (typeof Stripe === 'undefined') {
            console.warn('Stripe.js not loaded. Payment processing will be limited.');
            return;
        }
        
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        
        // Create card element
        const elements = stripe.elements();
        const cardStyle = {
            style: {
                base: {
                    color: '#1f2937',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#9ca3af'
                    }
                },
                invalid: {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#ef4444',
                    iconColor: '#ef4444'
                }
            }
        };

        cardElement = elements.create('card', cardStyle);
        cardElement.mount('#card-element');

        // Handle real-time validation errors from the card Element
        cardElement.on('change', ({error}) => {
            const displayError = document.getElementById('card-errors');
            if (error) {
                displayError.textContent = error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        console.log('Stripe initialized successfully');
    } catch (error) {
        console.error('Error initializing Stripe:', error);
    }
}

// Payment Method Switching
function setupPaymentMethodSwitching() {
    const cardRadio = document.querySelector('input[value="card"]');
    const upiRadio = document.querySelector('input[value="upi"]');
    const bankRadio = document.querySelector('input[value="bank"]');
    const stripeSection = document.getElementById('stripe-card-section');
    const upiSection = document.getElementById('upi-payment-section');
    const bankSection = document.getElementById('bank-transfer-section');
    
    if (!cardRadio || !upiRadio || !bankRadio || !stripeSection || !upiSection || !bankSection) return;
    
    function togglePaymentSections() {
        // Hide all sections first
        stripeSection.style.display = 'none';
        upiSection.style.display = 'none';
        bankSection.style.display = 'none';
        
        // Show selected section
        if (cardRadio.checked) {
            stripeSection.style.display = 'block';
        } else if (upiRadio.checked) {
            upiSection.style.display = 'block';
        } else if (bankRadio.checked) {
            bankSection.style.display = 'block';
        }
    }
    
    // Set initial state
    togglePaymentSections();
    
    // Listen for changes
    cardRadio.addEventListener('change', togglePaymentSections);
    upiRadio.addEventListener('change', togglePaymentSections);
    bankRadio.addEventListener('change', togglePaymentSections);
}

// Calculate Total Amount
function calculateTotalAmount() {
    const totalDisplay = document.getElementById('totalAmountDisplay');
    if (totalDisplay) {
        const totalText = totalDisplay.textContent;
        const amount = parseFloat(totalText.replace('₹', '').replace(',', ''));
        return isNaN(amount) ? 0 : Math.round(amount); // Return integer as expected by server
    }
    return 0;
}

// Show Payment Success
function showPaymentSuccess(message) {
    // Remove any existing payment messages
    const existingMessages = document.querySelectorAll('.payment-success, .payment-error');
    existingMessages.forEach(msg => msg.remove());
    
    // Create success message with better structure
    const successDiv = document.createElement('div');
    successDiv.className = 'payment-success';
    successDiv.innerHTML = `
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="success-text">
            ${message}
        </div>
    `;
    
    // Add to the form
    const step3 = document.getElementById('step3');
    if (step3) {
        step3.appendChild(successDiv);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 10000);
    }
}

// Enhanced Error Display
function showError(message) {
    // Remove any existing payment messages
    const existingMessages = document.querySelectorAll('.payment-success, .payment-error');
    existingMessages.forEach(msg => msg.remove());
    
    // Create error message with better structure
    const errorDiv = document.createElement('div');
    errorDiv.className = 'payment-error';
    errorDiv.innerHTML = `
        <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="error-text">
            ${message}
        </div>
    `;
    
    // Add to the current step
    const currentStepEl = document.querySelector('.form-step.active');
    if (currentStepEl) {
        currentStepEl.appendChild(errorDiv);
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 8000);
    } else {
        // Fallback to alert if no step found
        alert(message);
    }
}

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .error-message {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    @media (max-width: 768px) {
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(style); 