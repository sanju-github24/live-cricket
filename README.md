# 🏏 CricLive — Live Cricket Streaming Website

Full-stack cricket streaming platform with live scores, video player, and admin panel.

---

## 📁 Project Structure

```
cricket-streaming/
├── backend/          ← Node.js + Express + MongoDB
├── frontend/         ← React (Vite) — Public website
└── admin/            ← React (Vite) — Admin panel
```

---

## 🔑 Step 1 — Get Free Cricket API Key

1. Go to **https://cricketdata.org**
2. Sign up for a free account
3. Copy your **API Key** from the dashboard
4. Free tier: ~100 calls/day (enough for testing)

---

## ⚙️ Step 2 — Backend Setup

```bash
cd backend
npm install

# Edit .env file:
# CRICKET_API_KEY=your_key_here
# MONGO_URI=mongodb://localhost:27017/cricket_db
# JWT_SECRET=any_long_random_string

npm run dev   # starts on http://localhost:5000
```

### Create Admin Account (run once)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🎨 Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:3000
```

---

## 🛠 Step 4 — Admin Panel Setup

```bash
cd admin
npm install
npm run dev   # starts on http://localhost:3001
```

Login with the admin credentials you created above.

---

## 🚀 Features

### Public Website (localhost:3000)
- ✅ Live matches from CricketData.org API
- ✅ Auto-refresh every 30 seconds
- ✅ Full scorecard (batting + bowling)
- ✅ HLS video player (hls.js)
- ✅ YouTube embed support
- ✅ iFrame embed support
- ✅ Live score sidebar while watching
- ✅ Match schedule page

### Admin Panel (localhost:3001)
- ✅ Secure login with JWT
- ✅ Dashboard with stats
- ✅ Add stream (auto-fill from live matches)
- ✅ Manage all streams (edit, delete, toggle live)
- ✅ Support for HLS, YouTube, iFrame streams

---

## 📡 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/cricket/matches | All current matches |
| GET | /api/cricket/score/:id | Live scorecard |
| GET | /api/cricket/series | Series list |
| GET | /api/streams | All active streams |
| POST | /api/streams | Add stream (admin) |
| PUT | /api/streams/:id | Update stream (admin) |
| DELETE | /api/streams/:id | Delete stream (admin) |
| POST | /api/auth/login | Admin login |

---

## 🌐 Deployment

**Backend → Render.com**
- Build command: `npm install`
- Start command: `node server.js`
- Add all .env variables in Render dashboard

**Frontend → Vercel**
- Root directory: `frontend`
- Add env: `VITE_API_URL=https://your-render-url.onrender.com`

**Admin → Vercel**
- Root directory: `admin`
- Add env: `VITE_API_URL=https://your-render-url.onrender.com`

**MongoDB → MongoDB Atlas (free tier)**
- Create free cluster at mongodb.com/atlas
- Get connection string
- Add to MONGO_URI in Render

---

## 💡 How to Add a Stream

1. Open admin panel → http://localhost:3001
2. Login with admin credentials
3. Click **Add Stream**
4. Select match from dropdown (auto-fills match details)
5. Paste your stream URL:
   - HLS: `https://example.com/stream.m3u8`
   - YouTube: `https://www.youtube.com/watch?v=VIDEOID`
   - iFrame: any embed URL
6. Click **Add Stream** ✅

The stream will appear on the public website for that match!
