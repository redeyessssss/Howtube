// Profile Page JavaScript with Firebase Authentication
import {
  auth,
  database,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  ref,
  get,
  update
} from './firebase-config.js';

// Apply saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// State Management
let currentUser = null;
let isLoggedIn = false;

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    // Listen for auth state changes
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            await loadUserFromFirebase(user);
            isLoggedIn = true;
            showLoggedInView();
        } else {
            // User is signed out
            isLoggedIn = false;
            showNotLoggedInView();
        }
    });
    
    setupEventListeners();
});

// Load user data from Firebase
async function loadUserFromFirebase(user) {
    try {
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            currentUser = {
                id: user.uid,
                name: userData.name || user.displayName || 'User',
                email: userData.email || user.email,
                avatar: userData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&size=200`,
                joinedDate: userData.joinedDate,
                isPremium: userData.isPremium || false,
                isVerified: userData.isVerified || false
            };
        } else {
            // If no data in database, use auth data
            currentUser = {
                id: user.uid,
                name: user.displayName || 'User',
                email: user.email,
                avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=200`,
                joinedDate: new Date().toISOString(),
                isPremium: false,
                isVerified: false
            };
        }
        
        // Save to localStorage for quick access
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } catch (error) {
        console.error('Error loading user data:', error);
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
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Back Button
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Toggle Password Visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Show Signup
    const showSignupBtn = document.getElementById('showSignupBtn');
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }
    
    // Social Login Buttons
    const googleLoginBtn = document.querySelector('.social-btn:nth-child(1)');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }
    
    const facebookLoginBtn = document.querySelector('.social-btn:nth-child(2)');
    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', handleFacebookLogin);
    }
    
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

// Handle Login with Firebase
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Show loading
    showLoading();
    
    try {
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Load user data
        await loadUserFromFirebase(user);
        
        hideLoading();
        showMessage('Login successful! Welcome back!', 'success');
        
        setTimeout(() => {
            showLoggedInView();
        }, 1000);
        
    } catch (error) {
        hideLoading();
        console.error('Login error:', error);
        
        // Handle specific error codes
        let errorMsg = 'Login failed. Please try again.';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMsg = 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMsg = 'Incorrect password.';
                break;
            case 'auth/invalid-email':
                errorMsg = 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMsg = 'This account has been disabled.';
                break;
            case 'auth/network-request-failed':
                errorMsg = 'Network error. Please check your connection.';
                break;
        }
        showMessage(errorMsg, 'error');
    }
}

// Handle Google Login
async function handleGoogleLogin() {
    showLoading();
    
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        await loadUserFromFirebase(user);
        
        hideLoading();
        showMessage('Signed in with Google successfully!', 'success');
        
        setTimeout(() => {
            showLoggedInView();
        }, 1000);
        
    } catch (error) {
        hideLoading();
        console.error('Google login error:', error);
        
        if (error.code === 'auth/popup-closed-by-user') {
            showMessage('Sign in cancelled', 'error');
        } else {
            showMessage('Failed to sign in with Google', 'error');
        }
    }
}

// Handle Facebook Login
async function handleFacebookLogin() {
    showLoading();
    
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        
        await loadUserFromFirebase(user);
        
        hideLoading();
        showMessage('Signed in with Facebook successfully!', 'success');
        
        setTimeout(() => {
            showLoggedInView();
        }, 1000);
        
    } catch (error) {
        hideLoading();
        console.error('Facebook login error:', error);
        
        if (error.code === 'auth/popup-closed-by-user') {
            showMessage('Sign in cancelled', 'error');
        } else {
            showMessage('Failed to sign in with Facebook', 'error');
        }
    }
}

// Handle Logout with Firebase
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showLoading();
        
        signOut(auth).then(() => {
            // Clear localStorage
            localStorage.removeItem('currentUser');
            currentUser = null;
            isLoggedIn = false;
            
            hideLoading();
            showMessage('Logged out successfully!', 'success');
            
            setTimeout(() => {
                showNotLoggedInView();
            }, 1000);
        }).catch((error) => {
            hideLoading();
            console.error('Logout error:', error);
            showMessage('Failed to logout. Please try again.', 'error');
        });
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
