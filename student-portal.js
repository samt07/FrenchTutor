// Student Portal JavaScript
class StudentPortal {
    constructor() {
        this.currentStudent = null;
        this.subscriptionData = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingSession();
    }

    bindEvents() {
        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Quick action buttons
        document.getElementById('updatePaymentBtn').addEventListener('click', () => {
            this.updatePaymentMethod();
        });

        document.getElementById('downloadInvoiceBtn').addEventListener('click', () => {
            this.downloadInvoice();
        });

        document.getElementById('scheduleClassBtn').addEventListener('click', () => {
            this.scheduleClass();
        });

        document.getElementById('cancelSubscriptionBtn').addEventListener('click', () => {
            this.cancelSubscription();
        });
    }

    checkExistingSession() {
        const savedSession = localStorage.getItem('studentSession');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                if (session.expiresAt > Date.now()) {
                    this.currentStudent = session;
                    this.loadDashboard();
                } else {
                    localStorage.removeItem('studentSession');
                }
            } catch (error) {
                console.error('Error parsing saved session:', error);
                localStorage.removeItem('studentSession');
            }
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const subscriptionId = document.getElementById('subscriptionId').value;

        // Show loading state
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        submitBtn.disabled = true;

        try {
            // Call backend to verify student credentials
            const response = await fetch('/api/student-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    subscriptionId: subscriptionId
                })
            });

            const data = await response.json();

            if (data.success) {
                // Save session
                const session = {
                    ...data.student,
                    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                };
                localStorage.setItem('studentSession', JSON.stringify(session));
                
                this.currentStudent = session;
                this.subscriptionData = data.subscription;
                this.loadDashboard();
            } else {
                this.showError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Unable to connect to the server. Please try again.');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    loadDashboard() {
        // Hide login section and show dashboard
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';

        // Populate dashboard with student data
        this.populateDashboardData();
    }

    populateDashboardData() {
        // Student name
        document.getElementById('studentName').textContent = this.currentStudent.firstName || 'Student';

        // Subscription status
        const statusBadge = document.getElementById('statusBadge');
        const status = this.subscriptionData?.status || 'active';
        statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusBadge.className = `status-badge ${status}`;

        // Plan information
        const gradeLevel = this.currentStudent.gradeLevel;
        const planNames = {
            'elementary': 'Elementary School Plan',
            'middle': 'Middle School Plan',
            'high': 'High School Plan'
        };
        const planPrices = {
            'elementary': '₹3,500/month',
            'middle': '₹4,500/month',
            'high': '₹5,500/month'
        };

        document.getElementById('planName').textContent = planNames[gradeLevel] || 'School Plan';
        document.getElementById('planPrice').textContent = planPrices[gradeLevel] || '₹0/month';

        // Billing dates
        if (this.subscriptionData) {
            const nextBilling = new Date(this.subscriptionData.current_period_end * 1000);
            const startDate = new Date(this.subscriptionData.created * 1000);
            
            document.getElementById('nextBilling').textContent = nextBilling.toLocaleDateString();
            document.getElementById('startDate').textContent = startDate.toLocaleDateString();
        }

        // Progress data (mock data for now)
        this.loadProgressData();
        this.loadRecentActivity();
    }

    loadProgressData() {
        // This would typically come from your learning management system
        const progressData = {
            classesAttended: Math.floor(Math.random() * 20) + 5,
            hoursLearned: Math.floor(Math.random() * 30) + 10,
            currentLevel: ['A1', 'A2', 'B1'][Math.floor(Math.random() * 3)]
        };

        document.getElementById('classesAttended').textContent = progressData.classesAttended;
        document.getElementById('hoursLearned').textContent = progressData.hoursLearned;
        document.getElementById('currentLevel').textContent = progressData.currentLevel;

        // Progress message based on level
        const messages = {
            'A1': 'You\'re building a strong foundation in French! Keep practicing! 🌟',
            'A2': 'Great progress! You\'re becoming more confident in conversations. 🎯',
            'B1': 'Excellent work! You\'re developing advanced French skills. 🚀'
        };
        
        document.getElementById('progressMessage').textContent = 
            messages[progressData.currentLevel] || 'Keep up the great work! 🇫🇷';
    }

    loadRecentActivity() {
        // This would typically come from your backend
        const activities = [
            {
                type: 'payment',
                icon: 'fas fa-credit-card',
                title: 'Payment Successful',
                description: `Monthly subscription fee processed`,
                date: '2 days ago'
            },
            {
                type: 'class',
                icon: 'fas fa-graduation-cap',
                title: 'Class Completed',
                description: 'French Conversation Practice - Level A2',
                date: '3 days ago'
            },
            {
                type: 'achievement',
                icon: 'fas fa-trophy',
                title: 'Achievement Unlocked',
                description: 'Completed 10 consecutive classes',
                date: '1 week ago'
            }
        ];

        const activityList = document.getElementById('activityList');
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-details">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-date">${activity.date}</span>
                </div>
            </div>
        `).join('');
    }

    async updatePaymentMethod() {
        alert('Redirecting to secure payment method update...');
        // This would integrate with Stripe Customer Portal
        // window.location.href = '/api/create-customer-portal-session';
    }

    async downloadInvoice() {
        alert('Downloading latest invoice...');
        // This would generate/download the latest invoice
    }

    scheduleClass() {
        alert('Redirecting to class scheduling system...');
        // This would open the class booking interface
    }

    async cancelSubscription() {
        if (confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
            try {
                const response = await fetch('/api/cancel-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subscriptionId: this.subscriptionData.id
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Subscription cancelled successfully. You will continue to have access until the end of your current billing period.');
                    this.loadDashboard(); // Refresh the dashboard
                } else {
                    this.showError('Failed to cancel subscription. Please contact support.');
                }
            } catch (error) {
                console.error('Cancellation error:', error);
                this.showError('Unable to process cancellation. Please try again.');
            }
        }
    }

    handleLogout() {
        localStorage.removeItem('studentSession');
        this.currentStudent = null;
        this.subscriptionData = null;
        
        // Show login section and hide dashboard
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('dashboardSection').style.display = 'none';
        
        // Clear form
        document.getElementById('loginForm').reset();
    }

    showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        `;

        // Insert after the login form
        const loginForm = document.getElementById('loginForm');
        loginForm.parentNode.insertBefore(errorDiv, loginForm.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Initialize the student portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudentPortal();
}); 