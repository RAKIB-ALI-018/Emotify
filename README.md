# 🎧 Emotify

**Feel the music, powered by your mood.**

Emotify is a full-stack MERN application that detects your facial expression in real time using your webcam and plays a song that matches how you're feeling — happy, sad, or surprised.

---

## ✨ Features

- **Real-time facial expression detection** using MediaPipe's FaceLandmarker (blend-shape based scoring for happy, sad, and surprised expressions)
- **Mood-based random song recommendation** — every click fetches a different song matching your detected mood via MongoDB's `$sample` aggregation
- **Secure authentication** — JWT-based auth with bcrypt password hashing, httpOnly cookies, and Redis-backed token blacklisting on logout
- **Song upload pipeline** — MP3 metadata (title, cover art) auto-extracted via ID3 tags and stored on ImageKit
- **Spotify-inspired dark UI** — custom green-and-black theme built with SCSS, fully responsive across desktop and mobile
- **Persistent audio player** — bottom player bar with seek, volume, and playback controls

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- SCSS
- Context API + custom hooks for auth and song state
- MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Redis (token blacklisting)
- JWT + bcryptjs
- Multer (in-memory file handling)
- node-id3 (MP3 metadata extraction)
- ImageKit (audio + poster storage)

**Deployment**
- Render (Web Service for backend, Static Site for frontend)

---

## 📁 Project Structure

```
Moodify/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # auth.controller.js, song.controller.js
│   │   ├── middleware/      # auth.middleware.js, upload.middleware.js
│   │   ├── models/          # user.model.js, song.model.js
│   │   ├── routes/          # auth.routes.js, song.routes.js
│   │   ├── services/        # storage.service.js (ImageKit)
│   │   └── config/          # cache.js (Redis)
│   ├── app.js
│   └── server.js
│
└── Frontend/
    ├── src/
    │   ├── features/
    │   │   ├── auth/         # Login, Register, AuthContext, useAuth
    │   │   ├── expression/   # FaceExpression component, detection utils
    │   │   ├── home/         # Home page, Player, SongContext, useSong
    │   │   └── shared/       # global styles, shared assets
    │   ├── app.routes.jsx
    │   └── App.jsx
    └── index.html
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd Moodify
```

### 2. Backend setup
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
REDIS_URL=your_redis_connection_string
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
PORT=3000
```

Run the server:
```bash
node server.js
```

### 3. Frontend setup
```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:
```
VITE_API_BASE_URL=http://localhost:3000
```

Run the dev server:
```bash
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a session cookie |
| GET | `/api/auth/get-me` | Fetch the current logged-in user |
| GET | `/api/auth/logout` | Log out and blacklist the token |
| POST | `/api/songs` | Upload a new song (multipart/form-data) |
| GET | `/api/songs?mood=<mood>` | Fetch a random song matching the given mood |

---

## 🚀 Roadmap / Future Improvements

- Playlist history and favorites
- Multi-face detection support
- Song queueing instead of single-track playback
- OAuth login (Google)

---

## 👤 Author

**Rakib Ali**
B.Tech CS, NSUT
[GitHub](https://github.com/RAKIB-ALI-018) · [LinkedIn](https://www.linkedin.com/in/rakib-ali-a3366032a/)
