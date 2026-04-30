# ClipFetch

ClipFetch is a modern MERN stack video downloader web app concept.

It is designed as a clean and user-friendly single-page app where users can paste a public video link, analyze it, and view download options such as MP4 video and MP3 audio.

> Current status: The frontend UI is completed with mock data. Real video downloading is not connected yet.

---

## Preview

ClipFetch currently includes:

- Modern single-page UI
- Dark and light theme support
- Animated moving background
- Clean URL input section
- Fake analyze flow
- Processing animation
- Mock download options
- Video and audio tabs
- Responsive layout
- Smooth hover animations

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB / Mongoose planned

---

## Features Completed

- Dark and light theme toggle
- Animated aurora background
- Floating background elements
- Premium hover interactions
- URL input field
- Fake processing state
- Mock video result card
- MP4 and MP3 format preview
- Mobile responsive layout

---

## Planned Features

These features will be added in future steps:

- Backend API connection
- URL validation
- Platform detection
- YouTube, Facebook, Instagram, and TikTok support
- Real video metadata extraction
- MP4 download options
- MP3 audio conversion
- Download progress state
- Error handling
- Rate limiting
- User download history
- Premium plan support

---

## Project Structure

```txt
clipfetch/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── FormatOption.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProcessingCard.jsx
│   │   │   ├── ProcessSteps.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── UrlInput.jsx
│   │   ├── utils/
│   │   │   └── mockData.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   └── index.js
│   └── package.json
│
├── README.md
└── .gitignore