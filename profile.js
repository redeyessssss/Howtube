// Profile Page JavaScript

// State Management
let currentUser = null;
let isLoggedIn = false;

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    setupEventListeners();
});

// Check login status
function checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        isLoggedIn = true;
        showLoggedInView();
    } else {
        showNotLoggedInView();
    }
}

// Show/Hide Views
function showNotLoggedInView() {
    document.getElementById('notLoggedInView').classList.remove('hidden');
    document.getElementById('loggedInView').classList.add('hidden');
}

function showLoggedInView() {
    document.getElementById('notLoggedInView').classList.add('hidden');
    document.getElementById('loggedInView').classList.remove('hidden');
    loadUserProfile();
    loadUserStats();
    loadRecentActivity();
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Back Button
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Toggle Password Visibility
    document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);
    
    // Show Signup (placeholder)
    document.getElementById('showSignupBtn').addEventListener('click', () => {
        showMessage('Signup feature coming soon!', 'info');
    });
    
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Show loading
    showLoading();
    
    // Simulate API call (replace with actual database call later)
    setTimeout(() => {
        // For now, accept any email/password
        const user = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&size=200&background=dc2626&color=fff`,
            joinedDate: new Date().toISOString(),
            isPremium: true,
            isVerified: true
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        isLoggedIn = true;
        
        hideLoading();
        showMessage('Login successful! Welcome back!', 'success');
        
        setTimeout(() => {
            showLoggedInView();
        }, 1000);
    }, 1500);
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showLoading();
        
        setTimeout(() => {
            localStorage.removeItem('currentUser');
            currentUser = null;
            isLoggedIn = false;
            
            hideLoading();
            showMessage('Logged out successfully!', 'success');
            
            setTimeout(() => {
                showNotLoggedInView();
            }, 1000);
        }, 1000);
    }
}

// Load User Profile
function loadUserProfile() {
    if (!currentUser) return;
    
    document.getElementById('profileName').textContent = currentUser.name || 'User';
    document.getElementById('profileEmail').textContent = currentUser.email || 'user@example.com';
    document.getElementById('profileAvatar').src = currentUser.avatar || 'https://ui-avatars.com/api/?name=User&size=200';
}

// Load User Stats
function loadUserStats() {
    // Get data from localStorage
    const watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
    
    // Calculate stats
    const videosWatched = watchHistory.length;
    const watchTime = Math.floor(videosWatched * 2.5); // Estimate 2.5 hours per video
    const likedCount = likedVideos.length;
    const playlistCount = playlists.length;
    
    // Animate counters
    animateCounter('videosWatchedStat', videosWatched);
    animateCounter('watchTimeStat', watchTime, 'h');
    animateCounter('likedVideosStat', likedCount);
    animateCounter('playlistsStat', playlistCount);
}

// Animate Counter
function animateCounter(elementId, target, suffix = '') {
    const element = document.getElementById(elementId);
    let current = 0;
    const increment = target / 50;
    const duration = 1000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, stepTime);
}

// Load Recent Activity
function loadRecentActivity() {
    const watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const activityList = document.getElementById('activityList');
    
    if (watchHistory.length === 0) {
        activityList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p>No activity yet</p>
                <p class="text-sm mt-2">Start watching videos to see your activity here</p>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = watchHistory.slice(0, 10).map((item, index) => {
        const timeAgo = getTimeAgo(item.timestamp);
        return `
            <div class="activity-item" style="animation-delay: ${index * 0.1}s">
                <div class="activity-icon bg-red-100 text-red-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="activity-content">
                    <p class="activity-title">${item.title || 'Watched a video'}</p>
                    <p class="activity-time">${timeAgo}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Get Time Ago
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

// Switch Tab
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tabName}Tab`).classList.remove('hidden');
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('loginPassword');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
}

// Show Loading
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

// Hide Loading
function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Show Message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type} fixed top-4 right-4 z-50 shadow-lg`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
`;
document.head.appendChild(style);

// Export for use in other files
window.profileUtils = {
    getCurrentUser: () => currentUser,
    isUserLoggedIn: () => isLoggedIn,
    logout: handleLogout
};
