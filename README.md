# PREPX – Full-Stack Interview Preparation Platform

PREPX is a full-stack web application developed to help students prepare effectively for technical interviews, coding assessments, and placement drives. It provides a centralized platform where users can practice technical questions, attempt mock interviews, track progress, build resumes, and improve their preparation in a structured way.

![Dashboard Preview](frontend/public/images/hero_portrait.png)

---

##  Key Features

* **Dashboard** – Personalized dashboard to monitor preparation progress, streaks, completed tasks, and overall performance.
* **AI Insights** – Smart suggestions based on user activity, weak topics, and preparation trends.
* **Mock Interview Module** – Practice interview sessions with timed questions and performance tracking.
* **Progress Analytics** – Visual reports showing topic-wise growth, scores, and consistency.
* **Resume Builder** – Create professional ATS-friendly resumes with easy step-by-step forms.
* **To-Do Planner** – Manage daily preparation tasks and track completion status.
* **Question Bank & MCQs** – Curated interview questions across DSA, DBMS, OS, CN, and aptitude topics.
* **Responsive Design** – Works smoothly across desktop, tablet, and mobile devices.

---

## Tech Stack

### Frontend

* React 18 (Vite)
* React Router DOM
* TanStack React Query
* Framer Motion
* Three.js
* Lucide React
* CSS3 (Custom Responsive UI)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Helmet.js
* Express Rate Limit
* Winston Logger

---

##  Project Structure

```bash
prepx/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Global state management
│   │   ├── pages/           # Application pages
│   │   ├── utils/           # Helper functions
│   │   └── api/             # API configuration
│
├── backend/
│   ├── controllers/         # Request handling logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & security
│   └── config/              # Database config
```

---

##  Getting Started

### Prerequisites

* Node.js (v16 or above)
* MongoDB Atlas / Local MongoDB
* Git

---

### 1️ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ANTHROPIC_API_KEY=optional_key_for_ai_features
```

Run backend server:

```bash
npm run dev
```

---

### 2️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

* `POST /api/auth/register` – Register new user
* `POST /api/auth/login` – Login user
* `GET /api/progress` – Fetch user progress
* `GET /api/mock` – Get mock interview history
* `POST /api/ai/evaluate` – Evaluate answers with AI logic
* `PUT /api/resume` – Save resume data

---

## Future Enhancements

* Real-time AI interview voice assistant
* Company-wise interview preparation paths
* Leaderboard and achievements system
* Email reminders and notifications
* Personalized study roadmap generation

---

## Team Members

* Gaurav Sharma
* Kalash Thakur
* Ruhael Singh
* Mahikshit Choudhary

---

## Conclusion

PREPX is designed to simplify placement preparation by combining learning tools, practice modules, analytics, and productivity features into one platform. It helps students prepare consistently and confidently for interviews.

---

**Developed as a Final Year Major Project**
**© PREPX 2026**
