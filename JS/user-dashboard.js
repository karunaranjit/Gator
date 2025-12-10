// User Dashboard - Just displays the dashboard, NO login/signup here

// Copy photo code to clipboard
function copyPhotoCode() {
    const codeElement = document.getElementById('userPhotoCode');
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = codeElement.textContent;
        codeElement.textContent = 'Copied!';
        codeElement.style.color = '#4caf50';
        
        setTimeout(() => {
            codeElement.textContent = originalText;
            codeElement.style.color = '';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy code');
    });
}

function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.style.display = 'none');
    
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    event.target.closest('.tab-btn').classList.add('active');
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) targetTab.style.display = 'block';
}

function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function openEditProfileModal() {
    closeSettingsModal();
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function previewProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('editProfilePic');
            if (img) img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function removeProfilePicture() {
    if (confirm('Are you sure you want to remove your profile picture?')) {
        const img = document.getElementById('editProfilePic');
        if (img) img.src = '../assets/images/logo.png';
        alert('Profile picture removed!');
    }
}

function saveProfileChanges() {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    
    if (!name || !email) {
        alert('Please fill in all required fields!');
        return;
    }

    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    if (profileName) profileName.textContent = name;
    if (profileEmail) profileEmail.textContent = email;
    
    alert('Profile updated successfully! ✅');
    closeEditProfileModal();
}

function deleteAccount() {
    const confirmed = confirm('⚠️ WARNING: This action cannot be undone!\n\nAre you absolutely sure you want to delete your account?\n\nAll your data, photos, and events will be permanently deleted.');
    
    if (confirmed) {
        const doubleConfirm = prompt('Type "DELETE" to confirm account deletion:');
        if (doubleConfirm === 'DELETE') {
            alert('Account deleted successfully. Redirecting to home page...');
            window.location.href = './Home.html';
        } else {
            alert('Account deletion cancelled.');
        }
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = './User-Login.html';
    }
}

function filterPhotos() {
    alert('Filter feature - Backend will handle this');
}

function changeView() {
    alert('View change feature');
}

function toggleFavorite(photoId) {
    const heartIcon = event.target;
    heartIcon.classList.toggle('favorited');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Setup modal close listeners
    document.addEventListener('click', function(e) {
        if (e.target.id === 'settingsModal') closeSettingsModal();
        if (e.target.id === 'editProfileModal') closeEditProfileModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSettingsModal();
            closeEditProfileModal();
        }
    });
});