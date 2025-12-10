// Shared Data Layer - This will be replaced with real API calls later

const SharedData = {
    // User Authentication
    login(email, password) {
        // TODO: Backend API call
        // POST /api/auth/login
        // Body: { email, password }
        // Response: { success: true, user: { id, name, email, code, createdAt, photos, events } }
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    signup(name, email, password) {
        // TODO: Backend API call
        // POST /api/auth/signup
        // Body: { name, email, password }
        // Backend generates: unique code, id, createdAt timestamp
        // Response: { success: true, user: { id, name, email, code, createdAt, photos: [], events: [] } }
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already exists' };
        }
        
        // BACKEND GENERATES THIS - Frontend just sends name, email, password
        const newUser = {
            id: Date.now(), // Backend generates real ID
            name,
            email,
            password, // Backend hashes this
            code: 'USER' + Math.random().toString(36).substr(2, 5).toUpperCase(), // Backend generates unique code
            createdAt: new Date().toISOString(), // Backend sets timestamp
            photos: [],
            events: []
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        return { success: true, user: newUser };
    },

    getCurrentUser() {
        // TODO: Backend API call
        // GET /api/auth/me
        // Response: { id, name, email, code, createdAt, photos, events }
        
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    logout() {
        // TODO: Backend API call
        // POST /api/auth/logout
        // Backend clears session/token
        
        localStorage.removeItem('currentUser');
    },

    // Photos
    getUserPhotos(userId) {
        // TODO: Backend API call
        // GET /api/users/{userId}/photos
        // Response: [{ id, url, eventId, eventName, createdAt }]
        
        const user = this.getCurrentUser();
        return user ? user.photos : [];
    },

    getEventPhotos(eventCode) {
        // TODO: Backend API call
        // GET /api/events/{eventCode}/photos
        // Response: [{ id, url, uploadedAt, faces: [] }]
        
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const event = events.find(e => e.code === eventCode);
        return event ? event.photos : [];
    },

    findPhotosByFace(selfieData) {
        // TODO: Backend AI face matching API call
        // POST /api/ai/match-face
        // Body: { selfie: base64Image }
        // Backend uses AI to find matching faces
        // Response: [{ id, url, matchScore, eventId, eventName }]
        
        // Simulated AI matching - will be replaced with real backend
        return [];
    },

    // Events
    getEventByCode(code) {
        // TODO: Backend API call
        // GET /api/events/{code}
        // Response: { id, code, name, date, location, photographerId, photos: [] }
        
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        return events.find(e => e.code === code);
    },

    // Photographer functions (for desktop dashboard)
    createEvent(photographerId, eventData) {
        // TODO: Backend API call
        // POST /api/events
        // Body: { name, date, location }
        // Backend generates: unique event code, id, createdAt
        // Response: { id, code, name, date, location, photographerId, createdAt }
        
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const newEvent = {
            id: Date.now(), // Backend generates
            photographerId,
            code: 'EVT' + Math.random().toString(36).substr(2, 5).toUpperCase(), // Backend generates unique code
            ...eventData,
            photos: [],
            createdAt: new Date().toISOString() // Backend sets
        };
        
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        return newEvent;
    },

    uploadPhotos(eventId, photos) {
        // TODO: Backend API call
        // POST /api/events/{eventId}/photos
        // Body: FormData with photo files
        // Backend processes images, extracts faces with AI, generates URLs
        // Response: { uploadedCount, photos: [{ id, url, faces: [] }] }
        
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const event = events.find(e => e.id === eventId);
        
        if (event) {
            event.photos.push(...photos);
            localStorage.setItem('events', JSON.stringify(events));
        }
    }
};

// Export for use in both mobile and desktop
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedData;
}