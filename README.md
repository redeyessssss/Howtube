# 🎬 HowTube - Complete YouTube Clone

A fully-featured YouTube clone built with vanilla JavaScript, HTML, and CSS. Features 100+ functionalities including video playback, comments, playlists, analytics, and much more!

![HowTube](how.jpg)

## ✨ Features

### 🎥 Video Player (20+ features)
- Theater mode & Mini player
- Playback speed controls (0.25x - 2x)
- Quality selector
- Fullscreen mode
- Picture-in-Picture support
- Advanced controls overlay
- Volume & seek controls
- Comments button in player

### ⌨️ Keyboard Shortcuts
- `Space/K` - Play/Pause
- `Arrow Right` - Forward 5 seconds
- `Arrow Left` - Backward 5 seconds
- `Arrow Up/Down` - Volume control
- `F` - Fullscreen
- `M` - Mute/Unmute
- `T` - Theater mode
- `I` - Mini player

### 🔍 Search Features
- Search suggestions with history
- Voice search support
- Auto-save queries
- Real-time suggestions dropdown

### 💬 Comments System
- Full comments modal
- Post, like, and reply to comments
- Nested replies support
- Sort by Top/Newest
- User avatars

### 📊 Analytics Dashboard
- Total watch time tracking
- Videos watched counter
- Top categories chart
- Recent activity feed
- Beautiful gradient cards

### 🎯 Playlists System
- Create custom playlists
- Watch Later playlist
- Favorites playlist
- Add/remove videos
- Playlist thumbnails

### 🎥 Shorts Section
- TikTok-style vertical player
- Swipe navigation
- Like/Comment/Share buttons
- Full-screen experience

### 🔔 Notifications Center
- Notification dropdown
- Unread badge with pulse animation
- Mark all as read
- Different notification types

### ⚙️ Settings Panel
- Theme selector (Light/Dark/Auto)
- Language selector (5 languages)
- Autoplay toggle
- View density options

### 🎨 Video Cards
- Three-dot menu
- Channel avatars with verified badges
- Like/Share buttons
- Hover animations
- HD badges
- Progress indicators

### 📊 Filters & Sorting
- Chips filter bar
- Sort by: Relevance, Date, Views, Rating
- Duration filters
- Upload date filters
- Grid/List view modes

### 🎪 Sidebar Navigation (25+ options)
- Home, Trending, Subscriptions
- Shorts, Library, History
- Watch Later, Liked Videos
- Playlists, Analytics
- Explore: Popular, Music, Gaming, News, Sports, Live
- 10+ Categories with icons

### 💾 Data Persistence
All user data saved in localStorage:
- Watch history
- Liked videos
- Watch Later list
- Search history
- Playlists
- Notifications
- Settings preferences

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Python 3 (for local server)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/howtube.git
cd howtube
```

2. Start a local server
```bash
python3 -m http.server 8000
```

3. Open your browser and navigate to
```
http://localhost:8000/how.html
```

## 📁 Project Structure

```
howtube/
├── how.html              # Main HTML file
├── how.css               # Styling and animations
├── how.js                # Core functionality
├── how-features.js       # Advanced features
├── how-advanced.js       # Premium features
├── how.jpg               # Logo/thumbnail
└── README.md            # This file
```

## 🎮 Usage

### Basic Navigation
1. Click any video to play
2. Use keyboard shortcuts for quick controls
3. Try voice search by clicking the microphone icon
4. Open notifications to see updates
5. Check settings to customize your experience

### Advanced Features
- **Analytics**: Click "Analytics" in sidebar to view your stats
- **Playlists**: Click "Playlists" to create and manage playlists
- **Shorts**: Click "Shorts" for vertical video experience
- **Comments**: Click comments button in player to view/post comments
- **Mini Player**: Click mini player button to watch while browsing

## 🛠️ Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling, animations, and responsive design
- **Vanilla JavaScript** - All functionality (no frameworks!)
- **YouTube Data API v3** - Video data and search
- **YouTube IFrame API** - Video player integration
- **LocalStorage API** - Data persistence
- **Web Speech API** - Voice search
- **Share API** - Native sharing

## 🎨 Design Features

- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Custom scrollbars
- Dark mode support
- Accessibility features
- Print-friendly styles

## 📊 Statistics

- **100+ Features** implemented
- **5 JavaScript files** with modular code
- **1000+ lines** of CSS
- **2000+ lines** of JavaScript
- **Full YouTube API** integration
- **Zero dependencies** - Pure vanilla JS!

## 🔒 API Key

The project uses a YouTube Data API key. For production use:
1. Get your own API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Replace the API key in `how.js`:
```javascript
const API_KEY = "YOUR_API_KEY_HERE";
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- YouTube for the inspiration and API
- Google Fonts for typography
- Tailwind CSS for utility classes (CDN)
- Heroicons for beautiful SVG icons

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 🌟 Show Your Support

If you like this project, please give it a ⭐️ on GitHub!

---

**Made with ❤️ by [Your Name]**

*Note: This is a clone project for educational purposes. All rights to YouTube belong to Google LLC.*
