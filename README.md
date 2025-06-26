# 🏘️ Neighborhood Helper Network (N-Hub)

**N-Hub** is a full-stack community platform that connects people within local neighborhoods or campuses to **request and offer help**. Whether it's picking up groceries, helping with tech issues, or just lending a hand — N-Hub builds community support with **real-time chat, location-aware matching, karma points**, and an **admin panel** for moderation.

---

## 🚀 Features

- 🆘 Post and respond to help requests with urgency levels
- 🗺️ Location-based request matching via map
- 💬 Real-time chat between requester and helper (Socket.io)
- 🏅 Karma points system and helper leaderboard
- 🔐 JWT authentication and role-based access
- 🧑‍💼 Admin dashboard for user & request moderation
- 📊 Visual stats and feedback system
- 📱 Mobile responsive & PWA-ready

---

## 🛠 Tech Stack

| Layer       | Technology                              |
|------------|------------------------------------------|
| Frontend   | React.js, Tailwind CSS, React Router     |
| Backend    | Node.js, Express.js                      |
| Database   | MongoDB (GeoJSON support)                |
| Real-time  | Socket.io                                |
| Auth       | JWT, bcrypt                              |
| Maps       | Google Maps API / Leaflet.js             |
| Hosting    | Vercel (client), Render/Railway (server) |

---

## 📁 Project Structure

nhub/
├── client/ # React frontend
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── context/
│ └── ...
├── server/ # Node backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── middleware/
│ └── server.js
├── .env
├── package.json
└── README.md


---

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas or local setup

---

### 🖥️ Backend Setup

```bash
cd server
npm install

PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret


🌐 Frontend Setup
cd client
npm install
REACT_APP_BASE_URL=http://localhost:5000
npm start

🛡️ Environment Variables

Variable	Description
PORT	Port for backend server
MONGO_URI	MongoDB connection string
JWT_SECRET	JWT token secret
REACT_APP_BASE_URL	Client-side base API URL

Future Features
Smart helper matching using ML (skill + location + karma)

Spam detection using NLP

Mobile app (React Native)

Donations and anonymous help modes

🤝 Contributing
Fork this repo

Clone it to your local machine

Create a feature branch: git checkout -b feature-name

Commit your changes: git commit -m "Add feature"

Push to your branch: git push origin feature-name

Open a pull request
