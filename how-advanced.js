// ========================================
// ADVANCED FEATURES - PART 2
// ========================================

// Notifications System
let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

function initNotifications() {
    // Add some mock notifications
    if (notifications.length === 0) {
        notifications = [
            { id: 1, type: 'upload', title: 'New video from CookingChannel', message: 'How to make perfect pasta', time: '2 hours ago', read: false },
            { id: 2, type: 'like', title: 'Your comment got 50 likes', message: 'On "How to code in Python"', time: '5 hours ago', read: false },
            { id: 3, type: 'reply', title: 'Someone replied to your comment', message: 'Check out the discussion', time: '1 day ago', read: true }
        ];
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
    
    updateNotificationBadge();
    renderNotifications();
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

function renderNotifications() {
    const list = document.getElementById('notificationsList');
    if (!list) return;
    
    list.innerHTML = notifications.map(notif => `
        <div class="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${notif.read ? 'opacity-60' : ''}" data-notif-id="${notif.id}">
            <div class="flex gap-3">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-sm">${notif.title}</p>
                    <p class="text-sm text-gray-600">${notif.message}</p>
                    <p class="text-xs text-gray-400 mt-1">${notif.time}</p>
                </div>
                ${!notif.read ? '<div class="w-2 h-2 bg-blue-600 rounded-full"></div>' : ''}
            </div>
        </div>
    `).join('');
}

// Comments System
let comments = [];

function initComments() {
    comments = [
        { id: 1, author: 'John Doe', avatar: 'J', text: 'This is amazing! Thanks for sharing!', likes: 245, time: '2 days ago', replies: [] },
        { id: 2, author: 'Jane Smith', avatar: 'J', text: 'Very helpful tutorial. Can you make more like this?', likes: 128, time: '1 day ago', replies: [
            { id: 3, author: 'Creator', avatar: 'C', text: 'Thanks! More coming soon!', likes: 45, time: '1 day ago' }
        ]},
        { id: 4, author: 'Mike Johnson', avatar: 'M', text: 'Best explanation I\'ve seen on this topic!', likes: 89, time: '5 hours ago', replies: [] }
    ];
}

function renderComments() {
    const list = document.getElementById('commentsList');
    if (!list) return;
    
    list.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="flex gap-3">
                <div class="channel-avatar">${comment.avatar}</div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-semibold text-sm">${comment.author}</span>
                        <span class="text-xs text-gray-500">${comment.time}</span>
                    </div>
                    <p class="text-sm mb-2">${comment.text}</p>
                    <div class="flex items-center gap-4">
                        <button class="flex items-center gap-1 text-sm hover:bg-gray-100 px-2 py-1 rounded">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                            </svg>
                            <span>${comment.likes}</span>
                        </button>
                        <button class="text-sm hover:bg-gray-100 px-2 py-1 rounded">Reply</button>
                    </div>
                    ${comment.replies.length > 0 ? `
                        <div class="ml-8 mt-3 space-y-3">
                            ${comment.replies.map(reply => `
                                <div class="flex gap-3">
                                    <div class="channel-avatar">${reply.avatar}</div>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="font-semibold text-sm">${reply.author}</span>
                                            <span class="text-xs text-gray-500">${reply.time}</span>
                                        </div>
                                        <p class="text-sm mb-2">${reply.text}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function openCommentsModal() {
    initComments();
    renderComments();
    document.getElementById('commentsModal').classList.remove('hidden');
}

// Analytics System
function openAnalytics() {
    const modal = document.getElementById('analyticsModal');
    modal.classList.remove('hidden');
    
    // Calculate stats
    document.getElementById('totalWatchTime').textContent = `${watchHistory.length * 2}h`;
    document.getElementById('videosWatched').textContent = watchHistory.length;
    document.getElementById('likedCount').textContent = likedVideos.length;
    
    // Top categories (mock)
    const categories = [
        { name: 'Cooking', count: 45, percentage: 35 },
        { name: 'Coding', count: 32, percentage: 25 },
        { name: 'Music', count: 28, percentage: 22 },
        { name: 'Gaming', count: 23, percentage: 18 }
    ];
    
    document.getElementById('topCategories').innerHTML = categories.map(cat => `
        <div class="flex items-center justify-between">
            <span class="text-sm">${cat.name}</span>
            <div class="flex items-center gap-2">
                <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-600" style="width: ${cat.percentage}%"></div>
                </div>
                <span class="text-sm font-semibold">${cat.count}</span>
            </div>
        </div>
    `).join('');
    
    // Recent activity
    document.getElementById('recentActivity').innerHTML = watchHistory.slice(0, 5).map(video => `
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gray-200 rounded"></div>
            <div class="flex-1">
                <p class="text-sm font-semibold">${video.title}</p>
                <p class="text-xs text-gray-500">${new Date(video.timestamp).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

// Playlists System
let playlists = JSON.parse(localStorage.getItem('playlists') || '[]');

function initPlaylists() {
    if (playlists.length === 0) {
        playlists = [
            { id: 1, name: 'Watch Later', videos: watchLater, thumbnail: null },
            { id: 2, name: 'Favorites', videos: likedVideos, thumbnail: null }
        ];
        localStorage.setItem('playlists', JSON.stringify(playlists));
    }
}

function openPlaylistsModal() {
    initPlaylists();
    const modal = document.getElementById('playlistsModal');
    modal.classList.remove('hidden');
    
    document.getElementById('playlistsGrid').innerHTML = playlists.map(playlist => `
        <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
            <div class="aspect-video bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
            </div>
            <h4 class="font-semibold">${playlist.name}</h4>
            <p class="text-sm text-gray-600">${playlist.videos.length} videos</p>
        </div>
    `).join('');
}

// Shorts System
function openShorts() {
    document.getElementById('regularContent').classList.add('hidden');
    document.getElementById('shortsSection').classList.remove('hidden');
    showToast('Swipe up/down to navigate shorts');
}

function closeShorts() {
    document.getElementById('shortsSection').classList.add('hidden');
    document.getElementById('regularContent').classList.remove('hidden');
}

// Recommendations Sidebar
function showRecommendations() {
    const sidebar = document.getElementById('recommendationsSidebar');
    sidebar.classList.remove('hidden');
    
    // Mock recommendations
    const recommendations = [
        { title: 'How to cook pasta perfectly', channel: 'Cooking Master', views: '2.5M', thumbnail: '' },
        { title: 'Python tutorial for beginners', channel: 'Code Academy', views: '1.8M', thumbnail: '' },
        { title: 'Guitar lessons - Easy songs', channel: 'Music Teacher', views: '950K', thumbnail: '' }
    ];
    
    document.getElementById('recommendationsList').innerHTML = recommendations.map(video => `
        <div class="flex gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <div class="w-40 h-24 bg-gray-200 rounded flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold line-clamp-2">${video.title}</p>
                <p class="text-xs text-gray-600 mt-1">${video.channel}</p>
                <p class="text-xs text-gray-600">${video.views} views</p>
            </div>
        </div>
    `).join('');
}

// Settings System
function initSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsDropdown.classList.toggle('hidden');
        document.getElementById('notificationsDropdown').classList.add('hidden');
    });
    
    // Theme selector
    document.getElementById('themeSelect').addEventListener('change', (e) => {
        const theme = e.target.value;
        applyTheme(theme);
        showToast(`Theme changed to ${theme}`);
    });
    
    // Language selector
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        showToast(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
    });
    
    // Autoplay toggle
    document.getElementById('autoplayToggle').addEventListener('change', (e) => {
        showToast(e.target.checked ? 'Autoplay enabled' : 'Autoplay disabled');
    });
    
    // Density selector
    document.getElementById('densitySelect').addEventListener('change', (e) => {
        applyDensity(e.target.value);
        showToast(`View density: ${e.target.value}`);
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function applyDensity(density) {
    const container = document.getElementById('video-container');
    if (density === 'compact') {
        container.className = 'grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';
    } else if (density === 'cozy') {
        container.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8';
    } else {
        container.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    }
}

// Notifications dropdown
function initNotificationsDropdown() {
    const notifBtn = document.getElementById('notificationsBtn');
    const notifDropdown = document.getElementById('notificationsDropdown');
    
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
        document.getElementById('settingsDropdown').classList.add('hidden');
    });
    
    document.getElementById('markAllRead').addEventListener('click', () => {
        notifications.forEach(n => n.read = true);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        updateNotificationBadge();
        renderNotifications();
        showToast('All notifications marked as read');
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        notifDropdown.classList.add('hidden');
        document.getElementById('settingsDropdown').classList.add('hidden');
    });
}

// Event Listeners Setup
function setupAdvancedFeatures() {
    // Comments
    document.getElementById('closeCommentsBtn')?.addEventListener('click', () => {
        document.getElementById('commentsModal').classList.add('hidden');
    });
    
    document.getElementById('postCommentBtn')?.addEventListener('click', () => {
        const input = document.getElementById('commentInput');
        if (input.value.trim()) {
            showToast('Comment posted!');
            input.value = '';
        }
    });
    
    // Analytics
    document.getElementById('closeAnalyticsBtn')?.addEventListener('click', () => {
        document.getElementById('analyticsModal').classList.add('hidden');
    });
    
    // Playlists
    document.getElementById('closePlaylistsBtn')?.addEventListener('click', () => {
        document.getElementById('playlistsModal').classList.add('hidden');
    });
    
    document.getElementById('createPlaylistBtn')?.addEventListener('click', () => {
        const name = prompt('Enter playlist name:');
        if (name) {
            playlists.push({ id: Date.now(), name, videos: [], thumbnail: null });
            localStorage.setItem('playlists', JSON.stringify(playlists));
            openPlaylistsModal();
            showToast('Playlist created!');
        }
    });
    
    // Shorts
    document.getElementById('shortsBtn')?.addEventListener('click', openShorts);
    document.getElementById('closeShortsBtn')?.addEventListener('click', closeShorts);
    
    // Initialize systems
    initNotifications();
    initSettings();
    initNotificationsDropdown();
}

// Call this on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAdvancedFeatures);
} else {
    setupAdvancedFeatures();
}
