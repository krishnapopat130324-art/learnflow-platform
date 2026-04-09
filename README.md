================================================================================
                    LEARNFLOW - ADAPTIVE MICRO-LEARNING PLATFORM
================================================================================

PROJECT OVERVIEW
================================================================================
LearnFlow is a full-stack adaptive micro-learning platform with gamification 
features. It provides personalized learning paths, interactive quizzes, XP 
points, levels, badges, streaks, and detailed analytics.

TECHNOLOGIES USED
================================================================================
Frontend:      React.js, Tailwind CSS, Framer Motion, Axios
Backend:       Node.js, Express.js, JWT, bcrypt
Database:      MongoDB Atlas (Cloud)
Authentication: JWT with bcrypt password hashing
Deployment:    Render (Backend) + Vercel (Frontend)

FEATURES IMPLEMENTED
================================================================================
✅ User Authentication (Register/Login with JWT)
✅ Password Hashing using bcrypt (10 salt rounds)
✅ Role-Based Access Control (Student/Admin)
✅ Adaptive Learning Paths
✅ Gamification System (XP, Levels, Badges, Streaks)
✅ Interactive Quizzes with Automatic Scoring
✅ Progress Tracking & Analytics Dashboard
✅ 10+ Professional Themes (Light, Dark, Blue, Purple, Pink, etc.)
✅ Fully Responsive Design (Mobile, Tablet, Desktop)
✅ RESTful API with Express.js

SECURITY FEATURES
================================================================================
1. JWT Authentication
   - Tokens generated on login/register
   - Tokens expire after 7 days
   - Protected routes require valid token

2. Password Hashing (bcrypt)
   - Passwords hashed with 10 salt rounds
   - Original passwords never stored in database
   - Secure password comparison

3. Role-Based Access Control
   - Student role (default): Access to courses and quizzes
   - Admin role: Access to user management
   - Protected admin routes with role verification

4. Environment Variables
   - JWT_SECRET stored in .env file
   - MongoDB URI in environment variables
   - No hardcoded secrets in code

API ENDPOINTS
================================================================================
Method   Endpoint                       Description
------   --------                       -----------
POST     /api/auth/register             Register new user
POST     /api/auth/login                Login user
GET      /api/auth/me                   Get current user
POST     /api/auth/change-password      Change user password
GET      /api/lessons                   Get all lessons
GET      /api/lessons/:id               Get single lesson
GET      /api/quizzes/lesson/:lessonId  Get quiz by lesson
POST     /api/quizzes/submit            Submit quiz answers
GET      /api/progress                  Get user progress
GET      /api/analytics/user            Get user analytics
GET      /api/admin/users               Get all users (Admin only)
PUT      /api/admin/make-admin/:userId  Promote user (Admin only)

INSTALLATION & SETUP
================================================================================

Prerequisites:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (free tier)

Backend Setup:
--------------------------------------------------------------------------------
cd backend
npm install
npm run dev

Frontend Setup:
--------------------------------------------------------------------------------
cd frontend
npm install
npm start

Environment Variables (.env file in backend folder):
--------------------------------------------------------------------------------
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

HOW TO USE THE APPLICATION
================================================================================
1. Open browser and go to http://localhost:3000
2. Click "Create Account" and register with:
   - Name: Your name
   - Email: your@email.com
   - Password: at least 6 characters
3. Login with your credentials
4. Browse available courses on the Courses page
5. Click on any course to view lesson content
6. Click "Take Quiz" to test your knowledge
7. Answer all questions and submit
8. Earn 50 XP for passing (70% or higher)
9. Level up every 200 XP
10. Earn badges for achievements:
    - Quiz Master: 100% score
    - Expert: 500+ XP
    - Consistency Champion: 7 day streak
11. Track your progress on Analytics page
12. Change themes using palette icon in navbar

DEPLOYMENT
================================================================================

Deploy Backend on Render (Free):
--------------------------------------------------------------------------------
1. Push code to GitHub repository
2. Go to render.com and sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: node server.js
6. Add environment variables
7. Click "Deploy"

Deploy Frontend on Vercel (Free):
--------------------------------------------------------------------------------
1. Go to vercel.com and sign up with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: build
5. Add environment variable: REACT_APP_API_URL
6. Click "Deploy"

PROJECT STRUCTURE
================================================================================
micro-learning-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Lesson.js
│   │   ├── Quiz.js
│   │   └── Progress.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Layout.js
│   │   │   └── PrivateRoute.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Courses.js
│   │   │   ├── CourseDetail.js
│   │   │   ├── Quiz.js
│   │   │   ├── Analytics.js
│   │   │   └── Profile.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md

SUBMISSION INFORMATION
================================================================================
Project Name:    LearnFlow - Adaptive Micro-Learning Platform
Submitted By:    Krishna POpat

ALL REQUIREMENTS COMPLETED
================================================================================
☑ Project #1: Frontend Development (React + Tailwind)
☑ Project #2: Backend Development (Node.js + Express)
☑ Project #3: Database Integration (MongoDB Atlas)
☑ Project #4: Authentication & Security (JWT + bcrypt + RBAC)
☑ Project #5: Final Submission & Deployment

CONCLUSION
================================================================================
LearnFlow is a fully functional, production-ready adaptive learning platform 
with complete authentication, security, and gamification features. The 
application successfully implements all required components including JWT 
authentication, bcrypt password hashing, role-based access control, and 
secure environment variable management.

================================================================================
                    THANK YOU FOR USING LEARNFLOW!
================================================================================
