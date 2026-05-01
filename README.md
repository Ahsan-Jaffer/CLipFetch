# ClipFetch

ClipFetch is a modern MERN stack video downloader and converter web app.

It allows users to paste a public video link, analyze the media, view available download options, download video files, and convert audio to MP3 in different quality levels.

The project is built with a clean SaaS-style user interface, dark/light theme support, animated interactions, and a practical Node.js backend powered by `yt-dlp` and `ffmpeg`.

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

### In Progress / Planned

- Better download progress tracking
- Download history
- Batch downloads
- User accounts
- Premium limits
- Deployment setup
- Production-level queue system

---

## Features

### Modern Frontend

- Clean single-page layout
- Dark and light mode
- Responsive design
- Animated aurora background
- Premium hover effects
- Simple paste-and-analyze flow
- Download result preview card

### Video Analysis

- Paste a public video URL
- Detect supported platform
- Fetch real metadata
- Show title, thumbnail, duration, and formats

### Video Download

- Download available video formats
- Supports multiple quality options when available
- Browser-based file download
- Temporary server-side file handling

### MP3 Audio Download

- Convert video audio to MP3
- Multiple audio quality options:
  - 320kbps
  - 256kbps
  - 192kbps
  - 128kbps
- Audio-specific progress feedback

### User Experience

- Animated processing state
- Download progress toast
- Success and error messages
- One-download-at-a-time behavior
- Clean error handling for unsupported/private/restricted links

---

## Supported Platforms

Current platform detection supports:

- YouTube
- Instagram
- TikTok
- Facebook

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