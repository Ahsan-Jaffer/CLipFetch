# ClipFetch

ClipFetch is a modern MERN stack video downloader, audio converter, and playlist analyzer web application.

It allows users to paste a public video or playlist link, analyze the media, view available formats, download videos, convert audio to MP3, and selectively download playlist videos one by one.

The project is built with a clean SaaS-style UI, dark/light theme support, animated interactions, and a practical Node.js backend powered by `yt-dlp` and `ffmpeg`.

---

## Project Status

ClipFetch is currently in active development.

### Completed

- Modern single-page frontend UI
- Dark and light theme support
- Animated moving background
- Smooth hover and micro interactions
- Public URL analysis
- Platform detection
- Real metadata extraction using `yt-dlp`
- Real video download endpoint
- MP3 audio download and conversion
- Multiple MP3 quality options
- Download progress toast
- Professional backend error handling
- 2-hour video duration safety limit
- Temporary download file cleanup service
- Separate analyze/download rate limits
- Playlist analysis support
- Playlist video listing
- Playlist search/filter UI
- One-by-one playlist video download flow
- YouTube playlist/show URL handling

### Planned

- Better real-time download progress tracking
- Download history
- Batch downloads
- Playlist pagination for very large playlists
- Optional download queue system
- User accounts
- Premium limits
- Deployment setup
- Production-level background workers

---

## Features

### Modern Frontend

- Clean single-page layout
- Dark and light mode
- Responsive design
- Animated aurora background
- Premium hover effects
- Simple paste-and-analyze flow
- Video result preview card
- Playlist result interface
- Animated processing and download states

### Video Analysis

- Paste a public video URL
- Detect supported platform
- Fetch real metadata
- Show title, thumbnail, duration, uploader, and available formats
- Reject videos longer than the configured safety limit

### Video Download

- Download available video formats
- Supports multiple video quality options when available
- Browser-based file download
- Temporary server-side file handling
- Automatic cleanup for old temporary files

### MP3 Audio Download

- Convert video audio to MP3
- Multiple audio quality options:
  - 320kbps
  - 256kbps
  - 192kbps
  - 128kbps
- Audio-specific download progress feedback
- Uses `ffmpeg` for audio conversion

### Playlist Analyzer

- Paste a YouTube playlist or show link
- Fetch playlist title and video list
- Show all videos in a clean playlist interface
- Search videos inside the playlist
- Select any video from the playlist
- Prepare and download selected videos one by one
- Continue using the normal video/audio download flow for selected playlist videos

ClipFetch does not download the full playlist automatically.  
This keeps the app safer, lighter, and easier to use.

### User Experience

- Animated processing state
- Download progress toast
- Success and error messages
- One-download-at-a-time behavior
- Back-to-playlist navigation
- Clean error handling for unsupported/private/restricted links

---

## Supported Platforms

Current platform detection supports:

- YouTube
- Instagram
- TikTok
- Facebook

Playlist support is currently focused on YouTube playlist/show links.

Support depends on what `yt-dlp` can access from the given public URL.

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios

### Backend

- Node.js
- Express.js
- yt-dlp
- ffmpeg
- Helmet
- Morgan
- CORS
- Express Rate Limit

### Planned Database

- MongoDB
- Mongoose

---

## How It Works

### Single Video Flow

```txt
User pastes video URL
        ↓
Frontend sends URL to backend
        ↓
Backend validates URL
        ↓
Platform is detected
        ↓
yt-dlp extracts metadata
        ↓
Frontend shows video/audio options
        ↓
User selects format
        ↓
Backend downloads or converts file
        ↓
Browser starts download

```
## Project Structure

```
ClipFetch/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DownloadToast.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FormatOption.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PlaylistCard.jsx
│   │   │   ├── ProcessingCard.jsx
│   │   │   ├── ProcessSteps.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── UrlInput.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── analyzeController.js
│   │   │   └── downloadController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── notFoundHandler.js
│   │   │   └── rateLimiters.js
│   │   ├── routes/
│   │   │   ├── analyzeRoutes.js
│   │   │   └── downloadRoutes.js
│   │   ├── services/
│   │   │   ├── cleanupService.js
│   │   │   ├── downloadService.js
│   │   │   ├── metadataService.js
│   │   │   └── playlistService.js
│   │   ├── utils/
│   │   │   ├── AppError.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── detectPlatform.js
│   │   │   ├── fileUtils.js
│   │   │   ├── formatMetadata.js
│   │   │   └── formatPlaylist.js
│   │   └── index.js
│   └── package.json
│
├── README.md
├── .gitignore
├── package.json
└── start-dev.bat
```