// how.js — FULL UPDATED JS (drop into your project, replace old file)

// Move API key to environment variable or config file in production
const API_KEY = "AIzaSyARLESrFSVKUPSm52QR3jjBr-7_BWfLsJM";

let nextPageToken = "";
let currentQuery = "how to";
let isLoading = false;
let currentSection = "";
let debounceTimer = null;
let hasMoreResults = true;
let ytPlayer = null;
let playerReady = false;
let currentSort = "relevance";
let currentDuration = "any";
let currentUploadDate = "any";
let currentViewMode = "grid";
let totalResults = 0;
let watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
let likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
let watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
let currentPlayingVideo = null;
let miniPlayerActive = false;
let theaterMode = false;
let playbackSpeed = 1;

// Wait for YouTube API to be ready
window.onYouTubeIframeAPIReady = function() {
    playerReady = true;
    console.log("YouTube Player API ready");
};

// DOM refs
const container = document.getElementById("video-container");
const searchBox = document.getElementById("searchBox");
const loadingSpinner = document.getElementById("loadingSpinner");
const sidebar = document.getElementById("sidebar");

// Create a modal player for clean playback
createPlayerModal();

// Kick off initial search and setup category listeners
window.onload = () => {
    searchVideos(true);
    setupCategoryListeners();
    setupFilterListeners();
    setupViewModeListeners();
    setupSidebarButtons();
    setupMobileMenu();
    setupHeaderButtons();
    setupSearchSuggestions();
    setupChipsBar();
    setupScrollToTop();
    setupMiniPlayer();
    setupKeyboardShortcuts();
    loadSearchHistory();
};

// Setup category click listeners
function setupCategoryListeners() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            categoryItems.forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            const category = item.getAttribute('data-category');
            if (category) searchByCategory(category);
        });
    });
}

// Setup sidebar buttons
function setupSidebarButtons() {
    // Home
    document.getElementById('homeBtn').addEventListener('click', () => {
        setActiveSidebarItem('homeBtn');
        currentSection = "";
        searchBox.value = "how to";
        searchVideos(true);
    });

    // Trending
    document.getElementById('trendingBtn').addEventListener('click', () => {
        setActiveSidebarItem('trendingBtn');
        currentSection = "trending";
        searchBox.value = "";
        searchVideos(true);
    });

    // Subscriptions
    document.getElementById('subscriptionsBtn').addEventListener('click', () => {
        setActiveSidebarItem('subscriptionsBtn');
        searchBox.value = "how to subscribe";
        searchVideos(true);
    });

    // Library
    document.getElementById('libraryBtn').addEventListener('click', () => {
        setActiveSidebarItem('libraryBtn');
        searchBox.value = "how to tutorials";
        searchVideos(true);
    });

    // History
    document.getElementById('historyBtn').addEventListener('click', () => {
        setActiveSidebarItem('historyBtn');
        searchBox.value = "how to history";
        searchVideos(true);
    });

    // Watch Later
    document.getElementById('watchLaterBtn').addEventListener('click', () => {
        setActiveSidebarItem('watchLaterBtn');
        searchBox.value = "how to watch later";
        searchVideos(true);
    });

    // Liked Videos
    document.getElementById('likedBtn').addEventListener('click', () => {
        setActiveSidebarItem('likedBtn');
        searchBox.value = "popular how to";
        searchVideos(true);
    });

    // Playlists
    document.getElementById('playlistsBtn').addEventListener('click', () => {
        setActiveSidebarItem('playlistsBtn');
        openPlaylistsModal();
    });
    
    // Analytics
    document.getElementById('analyticsBtn').addEventListener('click', () => {
        setActiveSidebarItem('analyticsBtn');
        openAnalytics();
    });

    // Popular
    document.getElementById('popularBtn').addEventListener('click', () => {
        setActiveSidebarItem('popularBtn');
        searchBox.value = "popular how to";
        searchVideos(true);
    });

    // Music
    document.getElementById('musicBtn').addEventListener('click', () => {
        setActiveSidebarItem('musicBtn');
        searchBox.value = "how to music";
        searchVideos(true);
    });

    // Gaming
    document.getElementById('gamingBtn').addEventListener('click', () => {
        setActiveSidebarItem('gamingBtn');
        searchBox.value = "how to gaming";
        searchVideos(true);
    });

    // News
    document.getElementById('newsBtn').addEventListener('click', () => {
        setActiveSidebarItem('newsBtn');
        searchBox.value = "how to news";
        searchVideos(true);
    });

    // Sports
    document.getElementById('sportsBtn').addEventListener('click', () => {
        setActiveSidebarItem('sportsBtn');
        searchBox.value = "how to sports";
        searchVideos(true);
    });

    // Live
    document.getElementById('liveBtn').addEventListener('click', () => {
        setActiveSidebarItem('liveBtn');
        searchBox.value = "how to live stream";
        searchVideos(true);
    });
}

// Helper function to set active sidebar item
function setActiveSidebarItem(itemId) {
    document.querySelectorAll('.sidebar-item, .category-item').forEach(i => i.classList.remove('active'));
    document.getElementById(itemId).classList.add('active');
}

// Setup mobile menu
function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1024 && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }
}

// Setup header buttons
function setupHeaderButtons() {
    // Notifications - now opens dropdown
    document.getElementById('notificationsBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('notificationsDropdown');
        dropdown.classList.toggle('hidden');
    });

    // Settings - now opens dropdown
    // Handled in how-advanced.js

    // Profile button - handled by onclick in HTML (navigates to profile.html)
}

// Setup filter listeners
function setupFilterListeners() {
    // Sort dropdown
    const sortBtn = document.getElementById('sortBtn');
    const sortDropdown = document.getElementById('sortDropdown');
    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortDropdown.classList.toggle('hidden');
        document.getElementById('durationDropdown').classList.add('hidden');
        document.getElementById('uploadDateDropdown').classList.add('hidden');
    });

    document.querySelectorAll('.sort-option').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSort = btn.getAttribute('data-sort');
            document.getElementById('sortLabel').textContent = `Sort: ${btn.textContent}`;
            sortDropdown.classList.add('hidden');
            searchVideos(true);
            showClearFiltersBtn();
        });
    });

    // Duration dropdown
    const durationBtn = document.getElementById('durationBtn');
    const durationDropdown = document.getElementById('durationDropdown');
    durationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        durationDropdown.classList.toggle('hidden');
        sortDropdown.classList.add('hidden');
        document.getElementById('uploadDateDropdown').classList.add('hidden');
    });

    document.querySelectorAll('.duration-option').forEach(btn => {
        btn.addEventListener('click', () => {
            currentDuration = btn.getAttribute('data-duration');
            document.getElementById('durationLabel').textContent = `Duration: ${btn.textContent}`;
            durationDropdown.classList.add('hidden');
            searchVideos(true);
            showClearFiltersBtn();
        });
    });

    // Upload date dropdown
    const uploadDateBtn = document.getElementById('uploadDateBtn');
    const uploadDateDropdown = document.getElementById('uploadDateDropdown');
    uploadDateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        uploadDateDropdown.classList.toggle('hidden');
        sortDropdown.classList.add('hidden');
        durationDropdown.classList.add('hidden');
    });

    document.querySelectorAll('.upload-option').forEach(btn => {
        btn.addEventListener('click', () => {
            currentUploadDate = btn.getAttribute('data-upload');
            document.getElementById('uploadDateLabel').textContent = `Upload: ${btn.textContent}`;
            uploadDateDropdown.classList.add('hidden');
            searchVideos(true);
            showClearFiltersBtn();
        });
    });

    // Clear filters
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        currentSort = "relevance";
        currentDuration = "any";
        currentUploadDate = "any";
        document.getElementById('sortLabel').textContent = "Sort: Relevance";
        document.getElementById('durationLabel').textContent = "Duration: Any";
        document.getElementById('uploadDateLabel').textContent = "Upload: Any Time";
        document.getElementById('clearFiltersBtn').classList.add('hidden');
        searchVideos(true);
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        sortDropdown.classList.add('hidden');
        durationDropdown.classList.add('hidden');
        uploadDateDropdown.classList.add('hidden');
    });
}

function showClearFiltersBtn() {
    if (currentSort !== "relevance" || currentDuration !== "any" || currentUploadDate !== "any") {
        document.getElementById('clearFiltersBtn').classList.remove('hidden');
    }
}

// Setup view mode listeners
function setupViewModeListeners() {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const container = document.getElementById('video-container');

    gridViewBtn.addEventListener('click', () => {
        currentViewMode = "grid";
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";
        // Re-render current videos
        const videos = Array.from(container.children).map(card => card.videoData).filter(Boolean);
        container.innerHTML = "";
        renderVideos(videos);
    });

    listViewBtn.addEventListener('click', () => {
        currentViewMode = "list";
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        container.className = "flex flex-col gap-4";
        // Re-render current videos
        const videos = Array.from(container.children).map(card => card.videoData).filter(Boolean);
        container.innerHTML = "";
        renderVideos(videos);
    });
}

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ------------------------------
// SEARCH FUNCTIONS
// ------------------------------
function searchVideos(reset = false) {
    if (reset) {
        nextPageToken = "";
        container.innerHTML = "";
        hasMoreResults = true;
    }

    // section handling
    if (currentSection === "trending") currentQuery = "trending videos";
    else if (currentSection === "popular") currentQuery = "popular videos";
    else if (currentSection === "shorts") currentQuery = "shorts";
    else currentQuery = searchBox.value.trim() || "how to";

    fetchVideos(currentQuery);
}

// Debounced search helper (used on typing if you want)
function debouncedSearch(delay = 400) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(()=> searchVideos(true), delay);
}

// ------------------------------
// FETCH VIDEOS (search -> videos)
// ------------------------------
async function fetchVideos(query) {
    if (isLoading || !hasMoreResults) return;
    isLoading = true;
    showSkeleton();

    try {
        // Build search URL with filters
        let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&maxResults=20&pageToken=${nextPageToken}&q=${encodeURIComponent(query)}`;
        
        // Add order parameter
        if (currentSort === "date") searchUrl += "&order=date";
        else if (currentSort === "viewCount") searchUrl += "&order=viewCount";
        else if (currentSort === "rating") searchUrl += "&order=rating";
        
        // Add duration filter
        if (currentDuration === "short") searchUrl += "&videoDuration=short";
        else if (currentDuration === "medium") searchUrl += "&videoDuration=medium";
        else if (currentDuration === "long") searchUrl += "&videoDuration=long";
        
        // Add published after filter
        if (currentUploadDate !== "any") {
            const now = new Date();
            let publishedAfter;
            if (currentUploadDate === "hour") {
                publishedAfter = new Date(now.getTime() - 60 * 60 * 1000);
            } else if (currentUploadDate === "today") {
                publishedAfter = new Date(now.setHours(0, 0, 0, 0));
            } else if (currentUploadDate === "week") {
                publishedAfter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (currentUploadDate === "month") {
                publishedAfter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            } else if (currentUploadDate === "year") {
                publishedAfter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            }
            if (publishedAfter) {
                searchUrl += `&publishedAfter=${publishedAfter.toISOString()}`;
            }
        }
        
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        // Check for API errors (quota exceeded, invalid key, etc.)
        if (searchData.error) {
            throw new Error(searchData.error.message || "API error occurred");
        }

        if (!searchData || !searchData.items) {
            throw new Error("Invalid search response");
        }

        // update nextPageToken and check if more results exist
        nextPageToken = searchData.nextPageToken || "";
        if (!nextPageToken) {
            hasMoreResults = false;
        }

        // collect videoIds from search results with proper validation
        const videoIds = searchData.items
            .map(item => {
                if (item && item.id && typeof item.id.videoId === 'string') {
                    return item.id.videoId;
                }
                return null;
            })
            .filter(Boolean);

        if (videoIds.length === 0) {
            // nothing to show
            hideSkeleton();
            isLoading = false;
            hasMoreResults = false;
            showNoResultsIfEmpty();
            return;
        }

        // 2) Get video details (statistics, status, snippet)
        const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=snippet,statistics,status&id=${videoIds.join(",")}`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();

        // Check for API errors
        if (statsData.error) {
            throw new Error(statsData.error.message || "API error occurred");
        }

        if (!statsData || !statsData.items) {
            throw new Error("Invalid videos response");
        }

        // Map stats by id for quick lookup
        const statsMap = {};
        statsData.items.forEach(v => {
            if (v && v.id) {
                statsMap[v.id] = v;
            }
        });

        // Build merged array ensuring we preserve search order and attach realId
        const merged = searchData.items
            .map(s => {
                if (!s || !s.id || !s.id.videoId) return null;
                const vid = s.id.videoId;
                const statItem = statsMap[vid];
                if (!statItem) return null; // missing stats (private/region-blocked)
                // attach realId explicitly as a string
                statItem.realId = String(vid);
                return statItem;
            })
            .filter(Boolean);

        // Filter to ONLY embeddable videos
        const embeddableVideos = merged.filter(v => {
            return v.status && v.status.embeddable === true;
        });

        // Sort by view count
        const sortedVideos = embeddableVideos.sort((a, b) => {
            const aViews = Number(a.statistics?.viewCount || 0);
            const bViews = Number(b.statistics?.viewCount || 0);
            return bViews - aViews;
        });

        // If we got no embeddable videos, try fetching more
        if (sortedVideos.length === 0 && nextPageToken) {
            isLoading = false;
            hideSkeleton();
            fetchVideos(currentQuery); // recursively fetch next page
            return;
        }

        // Update total results
        if (searchData.pageInfo) {
            totalResults = searchData.pageInfo.totalResults || 0;
            updateResultsInfo();
        }

        // Render
        renderVideos(sortedVideos);

    } catch (err) {
        console.error("fetchVideos error:", err);
        const errorMsg = err.message.includes("quota") 
            ? "API quota exceeded. Please try again later."
            : "Failed to load videos. Please try again.";
        showErrorMessage(errorMsg);
    } finally {
        isLoading = false;
        hideSkeleton();
    }
}

// ------------------------------
// RENDER VIDEOS
// ------------------------------
function updateResultsInfo() {
    const resultsInfo = document.getElementById('resultsInfo');
    const videoCount = container.children.length - container.querySelectorAll('.skeleton-card').length;
    resultsInfo.textContent = `Showing ${videoCount} of ${totalResults.toLocaleString()} results`;
}

function renderVideos(videos) {
    if (!videos || videos.length === 0) {
        showNoResultsIfEmpty();
        return;
    }

    videos.forEach((video, index) => {
        const card = document.createElement("div");
        card.videoData = video; // Store video data for view mode switching
        
        if (currentViewMode === "list") {
            card.className = "video-card-list bg-white rounded-xl overflow-hidden cursor-pointer flex gap-4 hover:bg-gray-50 transition-all";
        } else {
            card.className = "video-card bg-white rounded-xl overflow-hidden cursor-pointer";
        }
        
        card.style.opacity = 0;
        card.style.transform = "translateY(20px)";
        card.setAttribute('data-video-id', video.realId || String(video.id));

        const thumbnailWrapper = document.createElement("div");
        thumbnailWrapper.className = currentViewMode === "list" ? "relative group overflow-hidden flex-shrink-0 w-64" : "relative group overflow-hidden";

        const thumbUrl = (video.snippet?.thumbnails?.high?.url) ||
                         (video.snippet?.thumbnails?.medium?.url) ||
                         (video.snippet?.thumbnails?.default?.url) || "";

        const thumbnail = document.createElement("img");
        thumbnail.src = thumbUrl;
        thumbnail.alt = video.snippet?.title || "video thumbnail";
        thumbnail.className = "w-full object-cover aspect-video thumbnail-preview";

        // Duration badge
        const duration = document.createElement("div");
        duration.className = "thumbnail-overlay";
        duration.textContent = "HD";

        // Video Menu (three dots)
        const videoMenu = document.createElement("div");
        videoMenu.className = "video-menu";
        videoMenu.innerHTML = `
            <button class="video-menu-btn">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
            </button>
        `;

        const playBadge = document.createElement("div");
        playBadge.className = "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20";
        playBadge.innerHTML = `
            <div class="bg-red-600 p-3 rounded-full transform group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </div>
        `;

        thumbnailWrapper.appendChild(thumbnail);
        thumbnailWrapper.appendChild(duration);
        thumbnailWrapper.appendChild(videoMenu);
        thumbnailWrapper.appendChild(playBadge);

        // Video menu dropdown
        const menuBtn = videoMenu.querySelector('.video-menu-btn');
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showVideoMenu(e, videoId, video.snippet?.title, thumbUrl);
        });

        // All videos here are embeddable (filtered in fetchVideos)
        const videoId = video.realId || String(video.id);

        // Click to play in modal
        card.addEventListener('click', () => {
            if (videoId) {
                openPlayerModal(videoId);
                addToWatchHistory(videoId, video.snippet?.title, thumbUrl, video.snippet?.channelTitle);
                saveToSearchHistory(currentQuery);
            }
        });

        const contentWrapper = document.createElement("div");
        contentWrapper.className = currentViewMode === "list" ? "flex-1 py-2" : "p-3";

        // Channel info with avatar
        const channelInfo = document.createElement("div");
        channelInfo.className = "flex items-start gap-3 mb-2";

        const channelAvatar = document.createElement("div");
        channelAvatar.className = "channel-avatar";
        channelAvatar.textContent = (video.snippet?.channelTitle || "U").charAt(0).toUpperCase();

        const videoInfo = document.createElement("div");
        videoInfo.className = "flex-1 min-w-0";

        const title = document.createElement("h3");
        title.className = currentViewMode === "list" ? "font-semibold text-base mb-1 text-gray-900" : "video-title font-semibold text-sm mb-1 text-gray-900";
        title.textContent = video.snippet?.title || "Untitled";

        const channel = document.createElement("p");
        channel.className = "channel-name text-gray-600 text-xs mb-1 hover:text-gray-900 cursor-pointer flex items-center";
        channel.innerHTML = `
            ${video.snippet?.channelTitle || "Unknown channel"}
            <span class="verified-badge">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
            </span>
        `;

        const views = document.createElement("p");
        views.className = "text-gray-600 text-xs";
        const viewCount = Number(video.statistics?.viewCount || 0).toLocaleString();
        const published = formatPublishDate(video.snippet?.publishedAt);
        views.textContent = `${viewCount} views • ${published}`;

        videoInfo.appendChild(title);
        videoInfo.appendChild(channel);
        videoInfo.appendChild(views);

        if (currentViewMode === "grid") {
            channelInfo.appendChild(channelAvatar);
        }
        channelInfo.appendChild(videoInfo);

        contentWrapper.appendChild(channelInfo);

        if (currentViewMode === "list") {
            // List view - add description
            const description = document.createElement("p");
            description.className = "text-gray-600 text-sm mt-2 line-clamp-2";
            description.textContent = video.snippet?.description || "";
            contentWrapper.appendChild(description);
        }

        // Action buttons (like, share, etc.)
        const actionButtons = document.createElement("div");
        actionButtons.className = "action-buttons";
        
        const isLiked = likedVideos.some(v => v.videoId === videoId);
        
        actionButtons.innerHTML = `
            <button class="action-btn ${isLiked ? 'active' : ''}" data-action="like">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                </svg>
                Like
            </button>
            <button class="action-btn" data-action="share">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                Share
            </button>
        `;

        // Action button handlers
        actionButtons.querySelector('[data-action="like"]').addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = e.currentTarget;
            const liked = toggleLike(videoId, video.snippet?.title);
            btn.classList.toggle('active', liked);
        });

        actionButtons.querySelector('[data-action="share"]').addEventListener('click', (e) => {
            e.stopPropagation();
            shareVideo(videoId, video.snippet?.title);
        });

        contentWrapper.appendChild(actionButtons);

        card.appendChild(thumbnailWrapper);
        card.appendChild(contentWrapper);

        container.appendChild(card);

        // Staggered animation
        setTimeout(() => {
            requestAnimationFrame(() => {
                card.style.opacity = 1;
                card.style.transform = "translateY(0)";
            });
        }, index * 50);
    });
}

// Format publish date like YouTube
function formatPublishDate(dateString) {
    if (!dateString) return "Recently";
    
    const now = new Date();
    const published = new Date(dateString);
    const diffMs = now - published;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffMonths < 12) return `${diffMonths} months ago`;
    return `${diffYears} years ago`;
}

// ------------------------------
// HELPERS: Skeletons, errors, empty state
// ------------------------------
function showSkeleton() {
    loadingSpinner.classList.remove("hidden");
    for (let i = 0; i < 8; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-card rounded-xl overflow-hidden";
        skeleton.innerHTML = `
            <div class="aspect-video bg-gray-200"></div>
            <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

function hideSkeleton() {
    loadingSpinner.classList.add("hidden");
    const skeletons = container.querySelectorAll(".skeleton-card");
    skeletons.forEach(s => s.remove());
}

function showErrorMessage(msg) {
    const el = document.createElement("div");
    el.className = "col-span-full text-center text-red-600 p-4";
    el.textContent = msg;
    container.appendChild(el);
}

function showNoResultsIfEmpty() {
    if (container.children.length === 0) {
        const el = document.createElement("div");
        el.className = "col-span-full text-center text-gray-600 p-6";
        el.innerHTML = `<p>No videos found for "${currentQuery}". Try another search.</p>`;
        container.appendChild(el);
    }
}

// ------------------------------
// SEARCH helpers (category & section)
// ------------------------------
function searchByCategory(category) {
    currentSection = "";
    searchBox.value = category;
    searchVideos(true);
}

function searchBySection(section) {
    currentSection = section;
    searchBox.value = "";
    searchVideos(true);
}

// ------------------------------
// DARK MODE
// ------------------------------
document.getElementById("darkModeBtn").addEventListener("click", ()=>{
    document.body.classList.toggle("dark-mode");
    // simple color invert using tailwind-friendly classes - user can adjust CSS
    document.body.classList.toggle("bg-gray-900");
    document.body.classList.toggle("text-white");
});

// ------------------------------
// SEARCH ON ENTER & BUTTON
// ------------------------------
searchBox.addEventListener("keypress", e=>{
    if (e.key === "Enter") searchVideos(true);
});
document.getElementById("searchBtn").addEventListener("click", ()=> searchVideos(true));

// ------------------------------
// INFINITE SCROLL
// ------------------------------
window.addEventListener("scroll", ()=>{
    // infinite load trigger - only if we have more results
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        if (nextPageToken && !isLoading && hasMoreResults) {
            fetchVideos(currentQuery);
        }
    }
});

// ------------------------------
// PLAYER MODAL (single iframe to prevent many iframes)
// ------------------------------
function createPlayerModal() {
    // create modal HTML and add to body
    const modal = document.createElement("div");
    modal.id = "playerModal";
    modal.className = "fixed inset-0 bg-black/60 hidden items-center justify-center z-50 p-4";
    modal.innerHTML = `
      <div id="playerContainer" class="bg-black rounded-lg max-w-6xl w-full overflow-hidden relative">
        <div class="flex justify-between items-center p-3 bg-black">
          <div class="flex items-center gap-3">
            <button id="theaterModeBtn" class="text-white p-2 hover:bg-gray-800 rounded" title="Theater mode (t)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
            </button>
            <button id="miniPlayerBtn" class="text-white p-2 hover:bg-gray-800 rounded" title="Miniplayer (i)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </button>
          </div>
          <button id="closePlayerBtn" class="text-white text-xl px-3 hover:bg-gray-800 rounded">✕</button>
        </div>
        <div id="playerWrap" class="w-full aspect-video bg-black relative"></div>
        
        <!-- Player Controls -->
        <div class="player-controls">
          <div class="control-bar">
            <button class="control-btn" id="playPauseBtn" title="Play/Pause (k)">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </button>
            
            <button class="control-btn" id="volumeBtn" title="Mute (m)">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path>
              </svg>
            </button>
            
            <div class="flex-1"></div>
            
            <button class="control-btn" id="speedBtn" title="Playback speed">
              <span class="text-sm font-semibold">1x</span>
            </button>
            
            <button class="control-btn" id="qualityBtn" title="Quality">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
              </svg>
            </button>
            
            <button class="control-btn" id="fullscreenBtn" title="Fullscreen (f)">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
              </svg>
            </button>
            
            <button class="control-btn" id="commentsBtn" title="Comments">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Setup control handlers
    setupPlayerControls();

    // close handler
    modal.querySelector("#closePlayerBtn").addEventListener("click", closePlayerModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closePlayerModal();
    });
}

function setupPlayerControls() {
    // Theater mode
    document.getElementById('theaterModeBtn').addEventListener('click', () => {
        const container = document.getElementById('playerContainer');
        container.classList.toggle('theater-mode');
        theaterMode = !theaterMode;
        showToast(theaterMode ? 'Theater mode on' : 'Theater mode off');
    });

    // Mini player
    document.getElementById('miniPlayerBtn').addEventListener('click', () => {
        if (currentPlayingVideo) {
            const title = document.querySelector(`[data-video-id="${currentPlayingVideo}"]`)?.querySelector('h3')?.textContent || 'Video';
            closePlayerModal();
            activateMiniPlayer(currentPlayingVideo, title);
        }
    });

    // Playback speed
    document.getElementById('speedBtn').addEventListener('click', () => {
        const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        playbackSpeed = speeds[nextIndex];
        
        if (ytPlayer && ytPlayer.setPlaybackRate) {
            ytPlayer.setPlaybackRate(playbackSpeed);
        }
        
        document.getElementById('speedBtn').querySelector('span').textContent = `${playbackSpeed}x`;
        showToast(`Speed: ${playbackSpeed}x`);
    });

    // Quality (mock)
    document.getElementById('qualityBtn').addEventListener('click', () => {
        showToast('Quality: Auto (1080p)');
    });

    // Fullscreen
    document.getElementById('fullscreenBtn').addEventListener('click', () => {
        toggleFullscreen();
    });
    
    // Comments
    document.getElementById('commentsBtn').addEventListener('click', () => {
        openCommentsModal();
    });
}

function openPlayerModal(videoId) {
    if (!videoId || typeof videoId !== 'string') {
        console.error("Invalid video ID provided to openPlayerModal");
        return;
    }

    currentPlayingVideo = videoId;

    const modal = document.getElementById("playerModal");
    const wrap = document.getElementById("playerWrap");

    if (!modal || !wrap) {
        console.error("Player modal elements not found");
        return;
    }

    // Show loading state
    wrap.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-black">
            <p class="text-white animate-pulse">Loading video...</p>
        </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    // Create a div for the YouTube player
    const playerDiv = document.createElement("div");
    playerDiv.id = "ytPlayer";
    playerDiv.className = "w-full h-full";
    
    wrap.innerHTML = "";
    wrap.appendChild(playerDiv);

    // Use YouTube Player API for better error handling
    try {
        if (ytPlayer) {
            ytPlayer.destroy();
        }

        ytPlayer = new YT.Player('ytPlayer', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'rel': 0,
                'modestbranding': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
                'onError': (event) => onPlayerError(event, videoId, wrap),
                'onStateChange': onPlayerStateChange
            }
        });
    } catch (error) {
        console.error("Error creating player:", error);
        showVideoError(videoId, wrap);
    }
}

function onPlayerReady(event) {
    console.log("Player ready, attempting to play");
    try {
        event.target.playVideo();
    } catch (e) {
        console.error("Error playing video:", e);
    }
}

function onPlayerStateChange(event) {
    // -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued
    console.log("Player state:", event.data);
}

function onPlayerError(event, videoId, wrap) {
    console.error("YouTube Player Error:", event.data);
    // Error codes: 2 = invalid param, 5 = HTML5 player error, 100 = video not found, 101/150 = not embeddable
    const errorCode = event.data;
    
    if (errorCode === 101 || errorCode === 150 || errorCode === 5) {
        // Video is not embeddable or restricted
        showVideoError(videoId, wrap);
    } else if (errorCode === 100) {
        wrap.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center bg-black text-white p-8">
                <svg class="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-xl font-bold mb-2">Video Not Found</h3>
                <p class="text-gray-400 mb-6 text-center">This video has been removed or is no longer available.</p>
            </div>
        `;
    } else {
        showVideoError(videoId, wrap);
    }
}

function showVideoError(videoId, wrap) {
    wrap.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-black text-white p-8">
            <svg class="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-bold mb-2">Video Restricted</h3>
            <p class="text-gray-400 mb-6 text-center">This video cannot be played in embedded players due to YouTube restrictions.</p>
            <a href="https://www.youtube.com/watch?v=${videoId}" 
               target="_blank" 
               rel="noopener" 
               class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                Watch on YouTube
            </a>
        </div>
    `;
}

function closePlayerModal() {
    const modal = document.getElementById("playerModal");
    const wrap = document.getElementById("playerWrap");
    
    // Destroy the player to stop playback
    if (ytPlayer) {
        try {
            ytPlayer.destroy();
            ytPlayer = null;
        } catch (e) {
            console.error("Error destroying player:", e);
        }
    }
    
    if (wrap) wrap.innerHTML = ""; // stops playback
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
}

// ------------------------------
// OPTIONAL: helper to go home (if your header link uses onclick)
function goHome() {
    currentSection = "";
    searchBox.value = "how to";
    searchVideos(true);
    return false;
}
