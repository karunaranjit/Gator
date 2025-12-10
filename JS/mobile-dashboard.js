let currentScreen = 'landingScreen';
let uploadedSelfie = null;

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

function showWelcomeScreen() {
    showScreen('welcomeScreen');
}

function showSelfieUpload() {
    showScreen('selfieScreen');
}

function showCodeEntry() {
    showScreen('codeScreen');
}

function showUserLogin() {
    showScreen('loginScreen');
}

function showUserSignup() {
    showScreen('signupScreen');
}

function goBack() {
    showScreen('welcomeScreen');
}

// User Login/Signup Functions
function handleUserLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Use shared data layer (will connect to real backend later)
    const result = SharedData.login(email, password);
    
    if (result.success) {
        // Update profile UI with user data
        document.getElementById('profileName').textContent = result.user.name;
        document.getElementById('profileEmail').textContent = result.user.email;
        document.getElementById('displayCode').textContent = result.user.code;
        
        showScreen('profileScreen');
        loadProfilePhotos();
    } else {
        alert(result.message || 'Login failed');
    }
}

function handleUserSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Use shared data layer (will connect to real backend later)
    const result = SharedData.signup(name, email, password);
    
    if (result.success) {
        // Update profile UI with user data
        document.getElementById('profileName').textContent = result.user.name;
        document.getElementById('profileEmail').textContent = result.user.email;
        document.getElementById('displayCode').textContent = result.user.code;
        
        showScreen('profileScreen');
        loadProfilePhotos();
    } else {
        alert(result.message || 'Signup failed');
    }
}

function toggleLoginPassword() {
    const passwordInput = document.getElementById('loginPassword');
    const eyeIcon = document.getElementById('loginEyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

function toggleSignupPassword() {
    const passwordInput = document.getElementById('signupPassword');
    const eyeIcon = document.getElementById('signupEyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Selfie Upload Handling
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
    document.getElementById('previewImage').src = '';
    document.getElementById('findPhotosBtn').disabled = false;
    document.getElementById('selfieInput').value = '';
}

function findPhotosBySelfie() {
    showScreen('matchedPhotosScreen');
    loadMatchedPhotos();
}

function loadMatchedPhotos() {
    const grid = document.getElementById('matchedPhotosGrid');
    const noPhotos = document.getElementById('noPhotos');
    const matchCount = document.getElementById('matchCount');
    
    grid.innerHTML = '';
    
    if (!uploadedSelfie) {
        grid.style.display = 'none';
        noPhotos.style.display = 'flex';
        matchCount.textContent = 'Found 0 photos';
        
        noPhotos.innerHTML = `
            <i class="fa-solid fa-image-slash"></i>
            <h3>Sorry, there are no photos of you</h3>
            <p>Please upload a selfie first to find matching photos.</p>
            <button class="btn-secondary" onclick="showSelfieUpload()">
                Try Again
            </button>
        `;
        return;
    }
    
    // Use shared data layer for AI face matching
    const matchedPhotos = SharedData.findPhotosByFace(uploadedSelfie);
    
    if (matchedPhotos.length > 0) {
        grid.style.display = 'grid';
        noPhotos.style.display = 'none';
        matchCount.textContent = `Found ${matchedPhotos.length} photos with your face`;
        
        matchedPhotos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `
                <img src="${photo.url}" alt="Photo ${index + 1}">
                <div class="photo-overlay">
                    <button onclick="downloadPhoto('${photo.id}')"><i class="fa-solid fa-download"></i></button>
                    <button onclick="sharePhoto('${photo.id}')"><i class="fa-solid fa-share"></i></button>
                </div>
            `;
            grid.appendChild(photoItem);
        });
    } else {
        grid.style.display = 'none';
        noPhotos.style.display = 'flex';
        matchCount.textContent = 'Found 0 photos';
        
        noPhotos.innerHTML = `
            <i class="fa-solid fa-image-slash"></i>
            <h3>Sorry, there are no photos of you in this event</h3>
            <p>We couldn't find any photos matching your face. Try uploading a different selfie or check back later.</p>
            <button class="btn-secondary" onclick="showSelfieUpload()">
                Try Again
            </button>
        `;
    }
}

// Code Entry
function submitCode() {
    const code = document.getElementById('codeInput').value.trim().toUpperCase();
    
    // Use shared data layer to get event
    const event = SharedData.getEventByCode(code);
    
    if (event) {
        // Update event UI
        document.getElementById('eventName').textContent = event.name || 'Event';
        document.getElementById('eventDate').textContent = event.date || '';
        document.getElementById('eventLocation').textContent = event.location || '';
        
        showScreen('eventPhotosScreen');
        loadEventPhotos(event.code);
    } else {
        // For testing, still show event screen
        showScreen('eventPhotosScreen');
        loadEventPhotos();
    }
}

function scanQRCode() {
    showScreen('eventPhotosScreen');
    loadEventPhotos();
}

function loadEventPhotos(eventCode = null) {
    const grid = document.getElementById('eventPhotosGrid');
    grid.innerHTML = '';
    
    // Use shared data layer to get event photos
    const photos = eventCode ? SharedData.getEventPhotos(eventCode) : [];
    
    if (photos.length > 0) {
        document.getElementById('totalPhotos').textContent = `${photos.length} Photos`;
        
        photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `
                <img src="${photo.url}" alt="Event Photo ${index + 1}">
                <div class="photo-overlay">
                    <button onclick="downloadPhoto('${photo.id}')"><i class="fa-solid fa-download"></i></button>
                    <button onclick="sharePhoto('${photo.id}')"><i class="fa-solid fa-share"></i></button>
                </div>
            `;
            grid.appendChild(photoItem);
        });
    } else {
        const noPhotosDiv = document.createElement('div');
        noPhotosDiv.className = 'no-photos';
        noPhotosDiv.style.display = 'flex';
        noPhotosDiv.innerHTML = `
            <i class="fa-solid fa-image-slash"></i>
            <h3>Sorry, there are no photos of you</h3>
            <p>There are no photos available for this event yet. Check back later!</p>
            <button class="btn-secondary" onclick="goBack()">
                Go Back
            </button>
        `;
        grid.appendChild(noPhotosDiv);
        document.getElementById('totalPhotos').textContent = '0 Photos';
    }
}

function loadProfilePhotos() {
    const grid = document.getElementById('profilePhotosGrid');
    grid.innerHTML = '';
    
    // Use shared data layer to get user photos
    const currentUser = SharedData.getCurrentUser();
    const photos = currentUser ? SharedData.getUserPhotos(currentUser.id) : [];
    
    // Update stats
    if (currentUser) {
        document.getElementById('photosFound').textContent = photos.length;
        document.getElementById('eventsAttended').textContent = currentUser.events?.length || 0;
    }
    
    if (photos.length > 0) {
        photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `
                <img src="${photo.url}" alt="Profile Photo ${index + 1}">
                <div class="photo-overlay">
                    <button onclick="downloadPhoto('${photo.id}')"><i class="fa-solid fa-download"></i></button>
                    <button onclick="sharePhoto('${photo.id}')"><i class="fa-solid fa-share"></i></button>
                </div>
            `;
            grid.appendChild(photoItem);
        });
    } else {
        const noPhotosDiv = document.createElement('div');
        noPhotosDiv.className = 'no-photos';
        noPhotosDiv.style.display = 'flex';
        noPhotosDiv.innerHTML = `
            <i class="fa-solid fa-image-slash"></i>
            <h3>Sorry, there are no photos of you</h3>
            <p>You don't have any photos yet. Upload a selfie or attend an event to get started!</p>
            <button class="btn-secondary" onclick="goBack()">
                Go Back
            </button>
        `;
        grid.appendChild(noPhotosDiv);
    }
}

// Profile Functions
function copyCode() {
    const code = document.getElementById('displayCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    });
}

function viewMyPhotos() {
    showScreen('matchedPhotosScreen');
    loadMatchedPhotos();
}

function editProfile() {
    alert('Edit profile feature coming soon!');
}

// Photo Actions
function downloadPhoto(id) {
    // TODO: Connect to backend download API
    alert(`Downloading photo ${id}...`);
}

function sharePhoto(id) {
    // TODO: Connect to backend share API
    alert(`Sharing photo ${id}...`);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile Dashboard loaded');
    
    // Check if user is already logged in
    const currentUser = SharedData.getCurrentUser();
    if (currentUser) {
        console.log('User already logged in:', currentUser);
    }
    
    const findPhotosBtn = document.getElementById('findPhotosBtn');
    if (findPhotosBtn) {
        findPhotosBtn.disabled = false;
    }
});