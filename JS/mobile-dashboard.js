let currentScreen = 'welcomeScreen';
let uploadedSelfie = null;

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Show back button except on welcome screen
    const backBtn = document.querySelector('.back-btn');
    if (screenId === 'welcomeScreen') {
        backBtn.style.display = 'none';
    } else {
        backBtn.style.display = 'flex';
    }
}

function goBack() {
    showScreen('welcomeScreen');
}

// Option Handlers
function showSelfieUpload() {
    showScreen('selfieScreen');
}

function showCodeEntry() {
    showScreen('codeScreen');
}

function showCreateAccount() {
    showScreen('createAccountScreen');
}

// Selfie Upload Handler
function handleSelfieUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedSelfie = e.target.result;
            document.getElementById('uploadArea').style.display = 'none';
            document.getElementById('selfiePreview').style.display = 'block';
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('findPhotosBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
}

function removeSelfie() {
    uploadedSelfie = null;
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('selfiePreview').style.display = 'none';
    document.getElementById('selfieInput').value = '';
    document.getElementById('findPhotosBtn').disabled = true;
}

function findPhotosBySelfie() {
    // Simulate AI face matching
    showScreen('matchedPhotosScreen');
    
    // Simulate loading photos (replace with actual API call)
    setTimeout(() => {
        const mockPhotos = generateMockPhotos(Math.floor(Math.random() * 10));
        displayMatchedPhotos(mockPhotos);
    }, 1000);
}

function displayMatchedPhotos(photos) {
    const grid = document.getElementById('matchedPhotosGrid');
    const noPhotos = document.getElementById('noPhotos');
    const matchCount = document.getElementById('matchCount');
    
    if (photos.length === 0) {
        grid.style.display = 'none';
        noPhotos.style.display = 'block';
        matchCount.textContent = 'Found 0 photos with your face';
    } else {
        grid.style.display = 'grid';
        noPhotos.style.display = 'none';
        matchCount.textContent = `Found ${photos.length} photos with your face`;
        
        grid.innerHTML = photos.map(photo => `
            <div class="photo-item" onclick="viewPhoto('${photo.url}')">
                <img src="${photo.url}" alt="Matched Photo">
                <div class="photo-overlay">
                    <button onclick="event.stopPropagation(); downloadPhoto('${photo.url}')">
                        <i class="fa-solid fa-download"></i>
                    </button>
                    <button onclick="event.stopPropagation(); sharePhoto('${photo.url}')">
                        <i class="fa-solid fa-share"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Code Submission
function submitCode() {
    const code = document.getElementById('codeInput').value.trim().toUpperCase();
    
    if (!code) {
        alert('Please enter a code');
        return;
    }
    
    // Check if it's a profile code or event code
    if (code.startsWith('EVT') || code.startsWith('WEDDING') || code.startsWith('PARTY')) {
        // Event Code
        loadEventPhotos(code);
    } else {
        // Profile Code
        loadUserProfile(code);
    }
}

function loadUserProfile(code) {
    // Simulate loading user profile (replace with actual API call)
    const profile = getUserProfile(code);
    
    if (profile) {
        document.getElementById('profileName').textContent = profile.name;
        document.getElementById('profileEmail').textContent = profile.email;
        document.getElementById('displayCode').textContent = code;
        document.getElementById('photosFound').textContent = profile.photosFound;
        document.getElementById('eventsAttended').textContent = profile.eventsAttended;
        document.getElementById('memberSince').textContent = profile.memberSince;
        
        showScreen('profileScreen');
        
        // Load user's photos
        const photos = generateMockPhotos(profile.photosFound);
        displayProfilePhotos(photos);
    } else {
        alert('Invalid profile code. Please try again.');
    }
}

function loadEventPhotos(code) {
    // Simulate loading event (replace with actual API call)
    const event = getEvent(code);
    
    if (event) {
        document.getElementById('eventName').textContent = event.name;
        document.getElementById('eventDate').textContent = event.date;
        document.getElementById('eventLocation').textContent = event.location;
        document.getElementById('totalPhotos').textContent = `${event.totalPhotos} Photos`;
        document.getElementById('downloads').textContent = `${event.downloads} Downloads`;
        
        showScreen('eventPhotosScreen');
        
        // Load event photos
        const photos = generateMockPhotos(event.totalPhotos);
        displayEventPhotos(photos);
    } else {
        alert('Invalid event code. Please try again.');
    }
}

function displayProfilePhotos(photos) {
    const grid = document.getElementById('profilePhotosGrid');
    grid.innerHTML = photos.map(photo => `
        <div class="photo-item" onclick="viewPhoto('${photo.url}')">
            <img src="${photo.url}" alt="Profile Photo">
            <div class="photo-overlay">
                <button onclick="event.stopPropagation(); downloadPhoto('${photo.url}')">
                    <i class="fa-solid fa-download"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function displayEventPhotos(photos) {
    const grid = document.getElementById('eventPhotosGrid');
    grid.innerHTML = photos.map(photo => `
        <div class="photo-item" onclick="viewPhoto('${photo.url}')">
            <img src="${photo.url}" alt="Event Photo">
            <div class="photo-overlay">
                <button onclick="event.stopPropagation(); downloadPhoto('${photo.url}')">
                    <i class="fa-solid fa-download"></i>
                </button>
                <button onclick="event.stopPropagation(); sharePhoto('${photo.url}')">
                    <i class="fa-solid fa-share"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Create Account
function createAccount(event) {
    event.preventDefault();
    
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    
    // Generate unique code
    const code = generateUniqueCode();
    
    // Save user profile (replace with actual API call)
    const profile = {
        code: code,
        name: name,
        email: email,
        phone: phone,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        photosFound: 0,
        eventsAttended: 0
    };
    
    localStorage.setItem(`profile_${code}`, JSON.stringify(profile));
    
    // Show success modal
    document.getElementById('generatedCode').textContent = code;
    document.getElementById('successModal').classList.add('active');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    showScreen('welcomeScreen');
}

function updateSelfieFileName() {
    const input = document.getElementById('accountSelfie');
    const fileName = document.getElementById('selfieFileName');
    if (input.files.length > 0) {
        fileName.textContent = input.files[0].name;
    }
}

// QR Code Scanner
function scanQRCode() {
    alert('QR Scanner will be integrated in the next update!');
}

// Photo Actions
function viewPhoto(url) {
    window.open(url, '_blank');
}

function downloadPhoto(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `photo_${Date.now()}.jpg`;
    link.click();
}

function sharePhoto(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this photo!',
            url: url
        });
    } else {
        alert('Share feature not supported on this device');
    }
}

function copyCode() {
    const code = document.getElementById('displayCode').textContent;
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
}

function viewMyPhotos() {
    // Already showing photos in profile
    document.getElementById('profilePhotosGrid').scrollIntoView({ behavior: 'smooth' });
}

function editProfile() {
    alert('Edit Profile feature coming soon!');
}

// Helper Functions
function generateUniqueCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function getUserProfile(code) {
    const stored = localStorage.getItem(`profile_${code}`);
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Mock data for testing
    if (code === 'ABC12345') {
        return {
            name: 'Aayush Kumar',
            email: 'aayush@example.com',
            memberSince: 'Dec 2025',
            photosFound: 42,
            eventsAttended: 5
        };
    }
    return null;
}

function getEvent(code) {
    // Mock event data
    const events = {
        'EVT12345': {
            name: 'Summer Wedding 2025',
            date: 'June 15, 2025',
            location: 'Grand Hotel, New York',
            totalPhotos: 245,
            downloads: 156
        },
        'WEDDING2025': {
            name: 'Sarah & John Wedding',
            date: 'July 20, 2025',
            location: 'Beach Resort, Miami',
            totalPhotos: 320,
            downloads: 234
        }
    };
    return events[code] || null;
}

function generateMockPhotos(count) {
    const photos = [];
    for (let i = 0; i < count; i++) {
        photos.push({
            url: `https://picsum.photos/400/400?random=${i}`,
            id: `photo_${i}`
        });
    }
    return photos;
}