// Signup Page JavaScript with Firebase Authentication
import {
  auth,
  database,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  facebookProvider,
  updateProfile,
  ref,
  set
} from './firebase-config.js';

// DOM Elements
const signupForm = document.getElementById('signupForm');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');
const agreeTerms = document.getElementById('agreeTerms');
const errorMessage = document.getElementById('errorMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const facebookSignupBtn = document.getElementById('facebookSignupBtn');

// Toggle Password Visibility
toggleSignupPassword.addEventListener('click', () => {
  const type = signupPassword.type === 'password' ? 'text' : 'password';
  signupPassword.type = type;
  signupConfirmPassword.type = type;
});

// Show Error Message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  setTimeout(() => {
    errorMessage.classList.add('hidden');
  }, 5000);
}

// Show Toast Notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Show/Hide Loading
function showLoading() {
  loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  loadingOverlay.classList.add('hidden');
}

// Save User Data to Database
async function saveUserData(userId, userData) {
  try {
    await set(ref(database, 'users/' + userId), {
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&size=200&background=dc2626&color=fff`,
      joinedDate: new Date().toISOString(),
      isPremium: false,
      isVerified: false,
      watchHistory: [],
      likedVideos: [],
      playlists: []
    });
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Handle Email/Password Signup
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validate inputs
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;
  
  if (!name) {
    showError('Please enter your full name');
    return;
  }
  
  if (!email) {
    showError('Please enter your email');
    return;
  }
  
  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }
  
  if (!agreeTerms.checked) {
    showError('Please agree to the Terms of Service and Privacy Policy');
    return;
  }
  
  showLoading();
  
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    await updateProfile(user, {
      displayName: name
    });
    
    // Save user data to database
    await saveUserData(user.uid, {
      name: name,
      email: email
    });
    
    // Save to localStorage for immediate access
    const userData = {
      id: user.uid,
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=dc2626&color=fff`,
      joinedDate: new Date().toISOString(),
      isPremium: false,
      isVerified: false
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    hideLoading();
    showToast('Account created successfully! Redirecting...', 'success');
    
    // Redirect to profile page
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    
  } catch (error) {
    hideLoading();
    console.error('Signup error:', error);
    
    // Handle specific error codes
    switch (error.code) {
      case 'auth/email-already-in-use':
        showError('This email is already registered. Please sign in instead.');
        break;
      case 'auth/invalid-email':
        showError('Invalid email address');
        break;
      case 'auth/weak-password':
        showError('Password is too weak. Please use a stronger password.');
        break;
      case 'auth/network-request-failed':
        showError('Network error. Please check your connection.');
        break;
      default:
        showError('Failed to create account. Please try again.');
    }
  }
});

// Handle Google Signup
googleSignupBtn.addEventListener('click', async () => {
  showLoading();
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user data to database
    await saveUserData(user.uid, {
      name: user.displayName || 'User',
      email: user.email,
      avatar: user.photoURL
    });
    
    // Save to localStorage
    const userData = {
      id: user.uid,
      name: user.displayName || 'User',
      email: user.email,
      avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=200&background=dc2626&color=fff`,
      joinedDate: new Date().toISOString(),
      isPremium: false,
      isVerified: true
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    hideLoading();
    showToast('Signed up with Google successfully!', 'success');
    
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    
  } catch (error) {
    hideLoading();
    console.error('Google signup error:', error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      showError('Sign up cancelled');
    } else {
      showError('Failed to sign up with Google. Please try again.');
    }
  }
});

// Handle Facebook Signup
facebookSignupBtn.addEventListener('click', async () => {
  showLoading();
  
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
    // Save user data to database
    await saveUserData(user.uid, {
      name: user.displayName || 'User',
      email: user.email,
      avatar: user.photoURL
    });
    
    // Save to localStorage
    const userData = {
      id: user.uid,
      name: user.displayName || 'User',
      email: user.email,
      avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=200&background=dc2626&color=fff`,
      joinedDate: new Date().toISOString(),
      isPremium: false,
      isVerified: true
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    hideLoading();
    showToast('Signed up with Facebook successfully!', 'success');
    
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    
  } catch (error) {
    hideLoading();
    console.error('Facebook signup error:', error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      showError('Sign up cancelled');
    } else {
      showError('Failed to sign up with Facebook. Please try again.');
    }
  }
});

// Password strength indicator (optional enhancement)
signupPassword.addEventListener('input', () => {
  const password = signupPassword.value;
  // You can add password strength indicator here
});
