# COMP3133 – Assignment 2  
## Employee Management System (Angular + GraphQL)

### 👩‍💻 Student Information
- Name: Arina Mirzakhani  
- Student ID: 101418340  
- Course: COMP3133 – Full Stack Development II   

---

## 📌 Project Overview
This project is a full-stack Employee Management System built using Angular for the frontend and GraphQL (Apollo Server + Express) for the backend.

The application allows users to:
- Sign up and log in securely
- Manage employee records (CRUD operations)
- Upload employee profile pictures
- Search employees by department or position

---

## 🚀 Live Deployment

### 🔗 Frontend (Angular – Vercel)
👉 https://101418340-comp3133-assignment2.vercel.app/login

### 🔗 Backend (GraphQL – Render)
👉 https://one01418340-comp3133-assignment2.onrender.com/graphql

---
### ⚠️ Backend Deployment Note

The backend is deployed on Render (free tier).
If the API has been inactive for a while, it may go to sleep.

When accessing the backend for the first time, it may take **30–60 seconds** to start.

Please wait briefly and refresh the page if needed.

---

## 🛠️ Technologies Used

### Frontend
- Angular (Standalone Components)
- Angular Material
- Reactive Forms
- Apollo Angular (GraphQL)
- TypeScript
- CSS

### Backend
- Node.js
- Express
- Apollo Server (GraphQL)
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Image Upload)

---

## 📂 Project Structure

studentID_comp3133_assignment2/
├── frontend/     # Angular Application
└── backend/      # GraphQL API (Assignment 1 extended)

---

## 🔐 Features Implemented

### 🔑 Authentication
- User Signup (with validation)
- User Login (GraphQL)
- Session management using JWT
- Logout functionality

---

### 👨‍💼 Employee Management (CRUD)
- View all employees (table format)
- Add new employee (with image upload)
- View employee details
- Update employee information
- Delete employee

---

### 🔍 Search Functionality
- Search employees by:
  - Department
  - Position (Designation)

---

### 🎨 UI/UX
- Angular Material Design
- Responsive layout
- Clean and professional UI
- Form validation with error messages

---

### ⚙️ Angular Features Used
- Components
- Routing (Login, Signup, Employees, Add, Update)
- Services (Auth & Employee)
- Pipes
- Directives
- Reactive Forms

---

## ⚠️ Validation & Error Handling
- Required field validation
- Email format validation
- Password minimum length validation
- Backend error handling (invalid login)
- Form-level error messages

---

## ▶️ How to Run Locally

1. Clone the repository
git clone https://github.com/arinamirzakhani/101418340_comp3133_assignment2.git

2. Install dependencies

Frontend:
cd frontend
npm install
ng serve

Backend:
cd backend
npm install
npm run dev

---

## 📌 Notes
- Backend is deployed on Render and connected to MongoDB Atlas.
- Frontend is deployed on Vercel and connected to the deployed backend.
- Environment variables are configured for production.

---

## 📎 GitHub Repository
👉 https://github.com/arinamirzakhani/101418340_comp3133_assignment2