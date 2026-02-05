# 🚀 Quick Setup Guide

## Push to GitHub

### Step 1: Create GitHub Repository
1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `howtube` or `youtube-clone`
3. Description: "Complete YouTube clone with 100+ features"
4. **Don't** check "Initialize with README"
5. Click "Create repository"

### Step 2: Push Your Code

Copy and paste these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/howtube.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages (Optional)

To host your project live on GitHub Pages:

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "main" branch
4. Click "Save"
5. Your site will be live at: `https://YOUR_USERNAME.github.io/howtube/how.html`

## Local Development

### Start the server:
```bash
python3 -m http.server 8000
```

### Open in browser:
```
http://localhost:8000/how.html
```

## Project Structure

```
howtube/
├── how.html              # Main HTML file
├── how.css               # Styling (1000+ lines)
├── how.js                # Core functionality (800+ lines)
├── how-features.js       # Advanced features (400+ lines)
├── how-advanced.js       # Premium features (300+ lines)
├── how.jpg               # Logo/thumbnail
├── README.md            # Documentation
├── .gitignore           # Git ignore rules
└── SETUP.md            # This file
```

## Features Included

✅ 100+ features
✅ Video player with advanced controls
✅ Comments system
✅ Analytics dashboard
✅ Playlists system
✅ Shorts section
✅ Notifications center
✅ Settings panel
✅ Search with voice support
✅ Full keyboard shortcuts
✅ Responsive design
✅ Dark mode support
✅ Data persistence (localStorage)

## API Key Setup

**Important:** For production use, replace the API key in `how.js`:

1. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Replace in `how.js`:
```javascript
const API_KEY = "YOUR_API_KEY_HERE";
```

## Troubleshooting

### Videos not playing?
- Make sure you're running on a local server (not file://)
- Check if the API key is valid
- Some videos may be restricted from embedding

### Sidebar not showing?
- Clear browser cache
- Check browser console for errors
- Make sure all JS files are loaded

### Features not working?
- Ensure all 5 files are in the same directory
- Check browser console for errors
- Try in a different browser

## Support

For issues or questions:
1. Check the README.md
2. Open an issue on GitHub
3. Check browser console for errors

## License

MIT License - Feel free to use and modify!

---

**Happy Coding! 🎉**
