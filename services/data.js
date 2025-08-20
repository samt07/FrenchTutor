const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = process.env.DATA_DIR || './data';
const DEMOS_FILE = path.join(DATA_DIR, 'demo-bookings.json');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');

// Initialize data directories and files
function initializeDataDirectories() {
    try {
        // Ensure data directory exists
        fs.ensureDirSync(DATA_DIR);
        
        // Initialize demo bookings file
        if (!fs.existsSync(DEMOS_FILE)) {
            fs.writeJsonSync(DEMOS_FILE, [], { spaces: 2 });
            console.log('📁 Created demo bookings file');
        }
        
        // Initialize registrations file
        if (!fs.existsSync(REGISTRATIONS_FILE)) {
            fs.writeJsonSync(REGISTRATIONS_FILE, [], { spaces: 2 });
            console.log('📁 Created registrations file');
        }
        
        console.log('📁 Data storage initialized at:', DATA_DIR);
    } catch (error) {
        console.error('❌ Error initializing data directories:', error);
        throw error;
    }
}

// Save demo booking
async function saveDemoBooking(demoData) {
    try {
        const bookingId = generateBookingId();
        const booking = {
            id: bookingId,
            ...demoData,
            bookingDate: new Date().toISOString(),
            status: 'pending'
        };
        
        // Read existing bookings
        const bookings = await fs.readJson(DEMOS_FILE);
        
        // Add new booking
        bookings.push(booking);
        
        // Write back to file
        await fs.writeJson(DEMOS_FILE, bookings, { spaces: 2 });
        
        console.log('📝 Demo booking saved:', bookingId);
        return bookingId;
    } catch (error) {
        console.error('❌ Error saving demo booking:', error);
        throw error;
    }
}

// Save registration
async function saveRegistration(registrationData) {
    try {
        const registrationId = generateRegistrationId();
        const registration = {
            id: registrationId,
            ...registrationData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Read existing registrations
        const registrations = await fs.readJson(REGISTRATIONS_FILE);
        
        // Add new registration
        registrations.push(registration);
        
        // Write back to file
        await fs.writeJson(REGISTRATIONS_FILE, registrations, { spaces: 2 });
        
        console.log('📝 Registration saved:', registrationId);
        return registrationId;
    } catch (error) {
        console.error('❌ Error saving registration:', error);
        throw error;
    }
}

// Get all demo bookings
function getDemoBookings() {
    try {
        return fs.readJsonSync(DEMOS_FILE);
    } catch (error) {
        console.error('❌ Error reading demo bookings:', error);
        return [];
    }
}

// Get all registrations
function getRegistrations() {
    try {
        return fs.readJsonSync(REGISTRATIONS_FILE);
    } catch (error) {
        console.error('❌ Error reading registrations:', error);
        return [];
    }
}

// Update demo booking status
async function updateDemoBookingStatus(bookingId, status, notes = '') {
    try {
        const bookings = await fs.readJson(DEMOS_FILE);
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        
        if (bookingIndex === -1) {
            throw new Error('Booking not found');
        }
        
        bookings[bookingIndex].status = status;
        bookings[bookingIndex].statusNotes = notes;
        bookings[bookingIndex].updatedAt = new Date().toISOString();
        
        await fs.writeJson(DEMOS_FILE, bookings, { spaces: 2 });
        
        console.log('📝 Demo booking status updated:', bookingId, status);
        return bookings[bookingIndex];
    } catch (error) {
        console.error('❌ Error updating demo booking status:', error);
        throw error;
    }
}

// Update registration status
async function updateRegistrationStatus(registrationId, status, paymentStatus = null) {
    try {
        const registrations = await fs.readJson(REGISTRATIONS_FILE);
        const regIndex = registrations.findIndex(r => r.id === registrationId);
        
        if (regIndex === -1) {
            throw new Error('Registration not found');
        }
        
        registrations[regIndex].status = status;
        if (paymentStatus) {
            registrations[regIndex].paymentStatus = paymentStatus;
        }
        registrations[regIndex].updatedAt = new Date().toISOString();
        
        await fs.writeJson(REGISTRATIONS_FILE, registrations, { spaces: 2 });
        
        console.log('📝 Registration status updated:', registrationId, status);
        return registrations[regIndex];
    } catch (error) {
        console.error('❌ Error updating registration status:', error);
        throw error;
    }
}

// Get demo booking by ID
function getDemoBookingById(bookingId) {
    try {
        const bookings = fs.readJsonSync(DEMOS_FILE);
        return bookings.find(b => b.id === bookingId);
    } catch (error) {
        console.error('❌ Error getting demo booking:', error);
        return null;
    }
}

// Get registration by ID
function getRegistrationById(registrationId) {
    try {
        const registrations = fs.readJsonSync(REGISTRATIONS_FILE);
        return registrations.find(r => r.id === registrationId);
    } catch (error) {
        console.error('❌ Error getting registration:', error);
        return null;
    }
}

// Search functions
function searchDemoBookings(criteria = {}) {
    try {
        const bookings = fs.readJsonSync(DEMOS_FILE);
        
        return bookings.filter(booking => {
            if (criteria.email && !booking.email.toLowerCase().includes(criteria.email.toLowerCase())) {
                return false;
            }
            if (criteria.status && booking.status !== criteria.status) {
                return false;
            }
            if (criteria.frenchLevel && booking.frenchLevel !== criteria.frenchLevel) {
                return false;
            }
            if (criteria.dateFrom && new Date(booking.preferredDate) < new Date(criteria.dateFrom)) {
                return false;
            }
            if (criteria.dateTo && new Date(booking.preferredDate) > new Date(criteria.dateTo)) {
                return false;
            }
            return true;
        });
    } catch (error) {
        console.error('❌ Error searching demo bookings:', error);
        return [];
    }
}

function searchRegistrations(criteria = {}) {
    try {
        const registrations = fs.readJsonSync(REGISTRATIONS_FILE);
        
        return registrations.filter(registration => {
            if (criteria.email && !registration.email.toLowerCase().includes(criteria.email.toLowerCase())) {
                return false;
            }
            if (criteria.paymentStatus && registration.paymentStatus !== criteria.paymentStatus) {
                return false;
            }
            if (criteria.classFormat && registration.classFormat !== criteria.classFormat) {
                return false;
            }
            if (criteria.package && registration.package !== criteria.package) {
                return false;
            }
            return true;
        });
    } catch (error) {
        console.error('❌ Error searching registrations:', error);
        return [];
    }
}

// Statistics
function getStatistics() {
    try {
        const demos = fs.readJsonSync(DEMOS_FILE);
        const registrations = fs.readJsonSync(REGISTRATIONS_FILE);
        
        const stats = {
            totalDemoBookings: demos.length,
            totalRegistrations: registrations.length,
            pendingDemos: demos.filter(d => d.status === 'pending').length,
            completedRegistrations: registrations.filter(r => r.paymentStatus === 'completed').length,
            totalRevenue: registrations
                .filter(r => r.paymentStatus === 'completed')
                .reduce((sum, r) => sum + (r.amount || 0), 0),
            packageBreakdown: {
                '4-lessons': registrations.filter(r => r.package === '4-lessons').length,
                '8-lessons': registrations.filter(r => r.package === '8-lessons').length,
                '16-lessons': registrations.filter(r => r.package === '16-lessons').length
            },
            classFormatBreakdown: {
                'private': registrations.filter(r => r.classFormat === 'private').length,
                'group': registrations.filter(r => r.classFormat === 'group').length,
                'conversation': registrations.filter(r => r.classFormat === 'conversation').length
            }
        };
        
        return stats;
    } catch (error) {
        console.error('❌ Error generating statistics:', error);
        return {};
    }
}

// Helper functions
function generateBookingId() {
    const prefix = 'DEMO';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

function generateRegistrationId() {
    const prefix = 'REG';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// Backup functions
async function createBackup() {
    try {
        const backupDir = path.join(DATA_DIR, 'backups');
        fs.ensureDirSync(backupDir);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
        
        const data = {
            demos: getDemoBookings(),
            registrations: getRegistrations(),
            timestamp: new Date().toISOString()
        };
        
        await fs.writeJson(backupFile, data, { spaces: 2 });
        console.log('💾 Backup created:', backupFile);
        
        return backupFile;
    } catch (error) {
        console.error('❌ Error creating backup:', error);
        throw error;
    }
}

module.exports = {
    initializeDataDirectories,
    saveDemoBooking,
    saveRegistration,
    getDemoBookings,
    getRegistrations,
    updateDemoBookingStatus,
    updateRegistrationStatus,
    getDemoBookingById,
    getRegistrationById,
    searchDemoBookings,
    searchRegistrations,
    getStatistics,
    createBackup
}; 