// ========================================
// ADDITIONAL FEATURES FOR HOWTUBE
// ========================================

// Search Suggestions
function setupSearchSuggestions() {
    const searchBox = document.getElementById('searchBox');
    const suggestionsDiv = document.getElementById('searchSuggestions');
    
    const suggestions = [
        'how to cook pasta',
        'how to code in python',
        'how to draw',
        'how to play guitar',
        'how to fix a car',
        'how to garden',
        'how to workout at home',
        'how to learn fast',
        'how to make money online',
        'how to edit videos'
    ];
    
    searchBox.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        
        if (value.length < 2) {
            suggestionsDiv.classList.add('hidden');
            return;
        }
        
        const filtered = suggestions.filter(s => s.includes(value));
        const history = searchHistory.filter(s => s.toLowerCase().includes(value)).slice(0, 3);
        
        if (filtered.length === 0 && history.length === 0) {
            suggestionsDiv.classList.add('hidden');
            return;
        }
        
        suggestionsDiv.innerHTML = '';
        
        // Show history first
        history.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-item';
            btn.style.color = '#030303';
            btn.innerHTML = `
                <svg class="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span style="color: #030303;">${item}</span>
            `;
            btn.addEventListener('click', () => {
                searchBox.value = item;
                searchVideos(true);
                suggestionsDiv.classList.add('hidden');
            });
            suggestionsDiv.appendChild(btn);
        });
        
        // Show suggestions
        filtered.slice(0, 5).forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-item';
            btn.style.color = '#030303';
            btn.innerHTML = `
                <svg class="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span style="color: #030303;">${item}</span>
            `;
            btn.addEventListener('click', () => {
                searchBox.value = item;
                searchVideos(true);
                suggestionsDiv.classList.add('hidden');
            });
            suggestionsDiv.appendChild(btn);
        });
        
        suggestionsDiv.classList.remove('hidden');
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.add('hidden');
        }
    });
}

// Chips Bar
function setupChipsBar() {
    const chips = document.querySelectorAll('.chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            const filter = chip.getAttribute('data-chip');
            applyChipFilter(filter);
        });
    });
}

function applyChipFilter(filter) {
    switch(filter) {
        case 'all':
            searchVideos(true);
            break;
        case 'new':
            currentSort = 'date';
            searchVideos(true);
            break;
        case 'live':
            searchBox.value = 'how to live';
            searchVideos(true);
            break;
        case 'popular':
            currentSort = 'viewCount';
            searchVideos(true);
            break;
        case 'recently':
            currentUploadDate = 'week';
            searchVideos(true);
            break;
        default:
            searchVideos(true);
    }
}

// Scroll to Top
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.remove('hidden');
        } else {
            scrollBtn.classList.add('hidden');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mini Player
function setupMiniPlayer() {
    const miniPlayer = document.getElementById('miniPlayer');
    const closeMiniBtn = document.getElementById('closeMiniPlayer');
    const expandMiniBtn = document.getElementById('expandMiniPlayer');
    
    closeMiniBtn.addEventListener('click', () => {
        miniPlayer.classList.add('hidden');
        miniPlayerActive = false;
        if (ytPlayer) {
            ytPlayer.pauseVideo();
        }
    });
    
    expandMiniBtn.addEventListener('click', () => {
        miniPlayer.classList.add('hidden');
        miniPlayerActive = false;
        if (currentPlayingVideo) {
            openPlayerModal(currentPlayingVideo);
        }
    });
}

function activateMiniPlayer(videoId, title) {
    const miniPlayer = document.getElementById('miniPlayer');
    const miniPlayerContent = document.getElementById('miniPlayerContent');
    const miniPlayerTitle = document.getElementById('miniPlayerTitle');
    
    miniPlayerTitle.textContent = title;
    miniPlayerContent.innerHTML = `<iframe class="w-full h-full" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
    
    miniPlayer.classList.remove('hidden');
    miniPlayerActive = true;
    currentPlayingVideo = videoId;
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only work when player is open
        if (!ytPlayer) return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                if (ytPlayer.getPlayerState() === 1) {
                    ytPlayer.pauseVideo();
                } else {
                    ytPlayer.playVideo();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                ytPlayer.seekTo(ytPlayer.getCurrentTime() + 5);
                showToast('Forward 5 seconds');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                ytPlayer.seekTo(ytPlayer.getCurrentTime() - 5);
                showToast('Backward 5 seconds');
                break;
            case 'ArrowUp':
                e.preventDefault();
                const currentVolume = ytPlayer.getVolume();
                ytPlayer.setVolume(Math.min(100, currentVolume + 10));
                showToast(`Volume: ${Math.min(100, currentVolume + 10)}%`);
                break;
            case 'ArrowDown':
                e.preventDefault();
                const volume = ytPlayer.getVolume();
                ytPlayer.setVolume(Math.max(0, volume - 10));
                showToast(`Volume: ${Math.max(0, volume - 10)}%`);
                break;
            case 'f':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'm':
                e.preventDefault();
                if (ytPlayer.isMuted()) {
                    ytPlayer.unMute();
                    showToast('Unmuted');
                } else {
                    ytPlayer.mute();
                    showToast('Muted');
                }
                break;
        }
    });
}

function toggleFullscreen() {
    const modal = document.getElementById('playerModal');
    if (!document.fullscreenElement) {
        modal.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Toast Notifications
function showToast(message, action = null, actionText = '') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastAction = document.getElementById('toastAction');
    
    toastMessage.textContent = message;
    
    if (action && actionText) {
        toastAction.textContent = actionText;
        toastAction.classList.remove('hidden');
        toastAction.onclick = action;
    } else {
        toastAction.classList.add('hidden');
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Search History
function loadSearchHistory() {
    searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
}

function saveToSearchHistory(query) {
    if (!searchHistory.includes(query)) {
        searchHistory.unshift(query);
        searchHistory = searchHistory.slice(0, 10); // Keep only 10
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// Watch History
function addToWatchHistory(videoId, title, thumbnail, channel) {
    const video = { videoId, title, thumbnail, channel, timestamp: Date.now() };
    watchHistory = watchHistory.filter(v => v.videoId !== videoId);
    watchHistory.unshift(video);
    watchHistory = watchHistory.slice(0, 50); // Keep only 50
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
}

// Like Video
function toggleLike(videoId, title) {
    const index = likedVideos.findIndex(v => v.videoId === videoId);
    
    if (index > -1) {
        likedVideos.splice(index, 1);
        showToast('Removed from Liked videos');
        return false;
    } else {
        likedVideos.push({ videoId, title, timestamp: Date.now() });
        localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
        showToast('Added to Liked videos');
        return true;
    }
}

// Watch Later
function toggleWatchLater(videoId, title, thumbnail) {
    const index = watchLater.findIndex(v => v.videoId === videoId);
    
    if (index > -1) {
        watchLater.splice(index, 1);
        showToast('Removed from Watch later');
        return false;
    } else {
        watchLater.push({ videoId, title, thumbnail, timestamp: Date.now() });
        localStorage.setItem('watchLater', JSON.stringify(watchLater));
        showToast('Saved to Watch later', () => {
            console.log('View Watch later');
        }, 'VIEW');
        return true;
    }
}

// Voice Search
function setupVoiceSearch() {
    const voiceBtn = document.getElementById('voiceSearchBtn');
    
    voiceBtn.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'en-US';
            recognition.start();
            
            showToast('🎤 Listening...');
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('searchBox').value = transcript;
                searchVideos(true);
                showToast(`Searching for: ${transcript}`);
            };
            
            recognition.onerror = () => {
                showToast('Voice search failed. Please try again.');
            };
        } else {
            showToast('Voice search not supported in this browser');
        }
    });
}

// Share Video
function shareVideo(videoId, title) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).then(() => {
            showToast('Shared successfully!');
        }).catch(() => {
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Link copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy link');
    });
}

// Initialize voice search
if (document.getElementById('voiceSearchBtn')) {
    setupVoiceSearch();
}

// Video Menu Dropdown
function showVideoMenu(event, videoId, title, thumbnail) {
    // Remove any existing menus
    document.querySelectorAll('.video-menu-dropdown').forEach(m => m.remove());
    
    const menu = document.createElement('div');
    menu.className = 'video-menu-dropdown';
    menu.innerHTML = `
        <button data-action="watchlater">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Save to Watch later</span>
        </button>
        <button data-action="playlist">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <span>Save to playlist</span>
        </button>
        <button data-action="share">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            <span>Share</span>
        </button>
        <button data-action="notinterested">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
            <span>Not interested</span>
        </button>
    `;
    
    // Position menu
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.right = `${window.innerWidth - rect.right}px`;
    
    document.body.appendChild(menu);
    
    // Handle menu actions
    menu.querySelector('[data-action="watchlater"]').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWatchLater(videoId, title, thumbnail);
        menu.remove();
    });
    
    menu.querySelector('[data-action="playlist"]').addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Playlist feature coming soon!');
        menu.remove();
    });
    
    menu.querySelector('[data-action="share"]').addEventListener('click', (e) => {
        e.stopPropagation();
        shareVideo(videoId, title);
        menu.remove();
    });
    
    menu.querySelector('[data-action="notinterested"]').addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Video removed from recommendations');
        menu.remove();
    });
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}
