# COMP3133 Assignment 2 – Frontend (Angular)

## Overview  
This is the Angular frontend for the Employee Management System built using Angular + GraphQL (Apollo Client).  
It connects to the backend GraphQL API to perform authentication and employee CRUD operations.

---

## Features  

### Authentication  
- User Signup with validation  
- User Login with JWT authentication  
- Session stored using localStorage  
- Logout functionality  

### Employee Management  
- View all employees  
- Add new employee (with image upload)  
- View employee details  
- Update employee information  
- Delete employee  

### Search  
- Search employees by department or position  

### Validation & UX  
- Reactive forms with validation  
- Error messages for invalid inputs  
- Angular Material UI for clean design  

---

## Technologies Used  
- Angular  
- Angular Material  
- Apollo Angular (GraphQL client)  
- TypeScript  
- RxJS  

---


## Installation & Setup  

1. Navigate to frontend folder:  
cd frontend  

2. Install dependencies:  
npm install  

3. Run the application:  
ng serve  

4. Open in browser:  
http://localhost:4200  

---


## Deployment  

Frontend is deployed on:  
👉 https://101418340-comp3133-assignment2.vercel.app/login

---

## Notes  

- Backend must be running for full functionality  
- JWT token is stored in localStorage  
- Uses Angular Material for UI components  