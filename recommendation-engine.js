// Personalized Recommendation Engine
// Tracks user behavior and provides personalized video recommendations

class RecommendationEngine {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.watchHistory = this.loadWatchHistory();
        this.searchHistory = this.loadSearchHistory();
        this.continueWatching = this.loadContinueWatching();
    }

    // Load user profile data
    loadUserProfile() {
        const profile = localStorage.getItem('userRecommendationProfile');
        if (profile) {
            return JSON.parse(profile);
        }
        return {
            interests: {},
            categories: {},
            channels: {},
            lastUpdated: Date.now()
        };
    }

    // Load watch history
    loadWatchHistory() {
        return JSON.parse(localStorage.getItem('watchHistory') || '[]');
    }

    // Load search history
    loadSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    // Load continue watching
    loadContinueWatching() {
        return JSON.parse(localStorage.getItem('continueWatching') || '[]');
    }

    // Save user profile
    saveUserProfile() {
        this.userProfile.lastUpdated = Date.now();
        localStorage.setItem('userRecommendationProfile', JSON.stringify(this.userProfile));
    }

    // Track video watch
    trackVideoWatch(video, watchTime, duration) {
        const watchPercentage = (watchTime / duration) * 100;
        
        // Update watch history
        const historyItem = {
            videoId: video.id.videoId || video.id,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            channelTitle: video.snippet.channelTitle,
            timestamp: Date.now(),
            watchTime: watchTime,
            duration: duration,
            watchPercentage: watchPercentage,
            category: this.extractCategory(video.snippet.title)
        };

        this.watchHistory.unshift(historyItem);
        this.watchHistory = this.watchHistory.slice(0, 100); // Keep last 100
        localStorage.setItem('watchHistory', JSON.stringify(this.watchHistory));

        // Update user profile interests
        this.updateInterests(video);

        // Handle continue watching
        if (watchPercentage < 90 && watchPercentage > 10) {
            this.addToContinueWatching(video, watchTime, duration);
        } else if (watchPercentage >= 90) {
            this.removeFromContinueWatching(video.id.videoId || video.id);
        }

        this.saveUserProfile();
    }

    // Track search query
    trackSearch(query) {
        const searchItem = {
            query: query,
            timestamp: Date.now()
        };

        this.searchHistory.unshift(searchItem);
        this.searchHistory = this.searchHistory.slice(0, 50); // Keep last 50
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));

        // Update interests based on search
        this.updateInterestsFromSearch(query);
        this.saveUserProfile();
    }

    // Add to continue watching
    addToContinueWatching(video, watchTime, duration) {
        const videoId = video.id.videoId || video.id;
        
        // Remove if already exists
        this.continueWatching = this.continueWatching.filter(
            item => item.videoId !== videoId
        );

        // Add to beginning
        this.continueWatching.unshift({
            videoId: videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            channelTitle: video.snippet.channelTitle,
            description: video.snippet.description,
            watchTime: watchTime,
            duration: duration,
            watchPercentage: (watchTime / duration) * 100,
            timestamp: Date.now()
        });

        // Keep only 20 items
        this.continueWatching = this.continueWatching.slice(0, 20);
        localStorage.setItem('continueWatching', JSON.stringify(this.continueWatching));
    }

    // Remove from continue watching
    removeFromContinueWatching(videoId) {
        this.continueWatching = this.continueWatching.filter(
            item => item.videoId !== videoId
        );
        localStorage.setItem('continueWatching', JSON.stringify(this.continueWatching));
    }

    // Get continue watching list
    getContinueWatching() {
        return this.continueWatching;
    }

    // Update user interests from video
    updateInterests(video) {
        const keywords = this.extractKeywords(video.snippet.title + ' ' + video.snippet.description);
        const category = this.extractCategory(video.snippet.title);
        const channel = video.snippet.channelTitle;

        // Update keyword interests
        keywords.forEach(keyword => {
            this.userProfile.interests[keyword] = (this.userProfile.interests[keyword] || 0) + 1;
        });

        // Update category interests
        if (category) {
            this.userProfile.categories[category] = (this.userProfile.categories[category] || 0) + 1;
        }

        // Update channel interests
        this.userProfile.channels[channel] = (this.userProfile.channels[channel] || 0) + 1;
    }

    // Update interests from search
    updateInterestsFromSearch(query) {
        const keywords = this.extractKeywords(query);
        keywords.forEach(keyword => {
            this.userProfile.interests[keyword] = (this.userProfile.interests[keyword] || 0) + 2; // Weight searches higher
        });
    }

    // Extract keywords from text
    extractKeywords(text) {
        const stopWords = ['how', 'to', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'for', 'with', 'about', 'as', 'by', 'is', 'was', 'are', 'were'];
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.includes(word));
        
        return [...new Set(words)].slice(0, 10); // Unique words, max 10
    }

    // Extract category from title
    extractCategory(title) {
        const categories = {
            'cooking': ['cook', 'recipe', 'food', 'bake', 'kitchen', 'chef'],
            'coding': ['code', 'programming', 'javascript', 'python', 'web', 'developer', 'software'],
            'diy': ['diy', 'fix', 'repair', 'build', 'make', 'craft'],
            'learning': ['learn', 'tutorial', 'education', 'course', 'lesson', 'study'],
            'art': ['draw', 'paint', 'art', 'design', 'creative', 'sketch'],
            'music': ['music', 'song', 'guitar', 'piano', 'sing', 'instrument'],
            'fitness': ['workout', 'exercise', 'fitness', 'gym', 'yoga', 'training'],
            'gaming': ['game', 'gaming', 'play', 'gameplay', 'gamer'],
            'travel': ['travel', 'trip', 'vacation', 'destination', 'tour'],
            'tech': ['tech', 'technology', 'gadget', 'review', 'unbox']
        };

        const lowerTitle = title.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerTitle.includes(keyword))) {
                return category;
            }
        }
        return 'general';
    }

    // Get personalized recommendations
    getRecommendationQuery() {
        // Get top interests
        const topInterests = Object.entries(this.userProfile.interests)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([keyword]) => keyword);

        // Get top categories
        const topCategories = Object.entries(this.userProfile.categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([category]) => category);

        // Combine for search query
        const query = [...topInterests, ...topCategories].join(' ');
        
        return query || 'how to'; // Default if no profile
    }

    // Get recommendation score for a video
    getRecommendationScore(video) {
        let score = 0;
        const title = video.snippet.title.toLowerCase();
        const description = (video.snippet.description || '').toLowerCase();
        const channel = video.snippet.channelTitle;

        // Check interests
        Object.entries(this.userProfile.interests).forEach(([keyword, weight]) => {
            if (title.includes(keyword) || description.includes(keyword)) {
                score += weight;
            }
        });

        // Check categories
        const category = this.extractCategory(video.snippet.title);
        if (this.userProfile.categories[category]) {
            score += this.userProfile.categories[category] * 2;
        }

        // Check channels
        if (this.userProfile.channels[channel]) {
            score += this.userProfile.channels[channel] * 3;
        }

        return score;
    }

    // Sort videos by recommendation score
    sortByRecommendation(videos) {
        return videos.map(video => ({
            video,
            score: this.getRecommendationScore(video)
        }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.video);
    }

    // Get user statistics
    getUserStats() {
        return {
            totalWatched: this.watchHistory.length,
            topCategory: this.getTopCategory(),
            topInterest: this.getTopInterest(),
            continueWatchingCount: this.continueWatching.length,
            searchCount: this.searchHistory.length
        };
    }

    // Get top category
    getTopCategory() {
        const entries = Object.entries(this.userProfile.categories);
        if (entries.length === 0) return 'None';
        return entries.sort((a, b) => b[1] - a[1])[0][0];
    }

    // Get top interest
    getTopInterest() {
        const entries = Object.entries(this.userProfile.interests);
        if (entries.length === 0) return 'None';
        return entries.sort((a, b) => b[1] - a[1])[0][0];
    }

    // Clear user data
    clearUserData() {
        this.userProfile = {
            interests: {},
            categories: {},
            channels: {},
            lastUpdated: Date.now()
        };
        this.watchHistory = [];
        this.searchHistory = [];
        this.continueWatching = [];
        
        localStorage.removeItem('userRecommendationProfile');
        localStorage.removeItem('continueWatching');
    }
}

// Export for use in other files
window.RecommendationEngine = RecommendationEngine;
