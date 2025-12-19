# MERN Stack Job Board Platform

A complete job board application built with MongoDB, Express.js, React.js, and Node.js.

## Features

### For Candidates
- View all job openings
- View detailed job descriptions
- Apply for jobs with resume upload (PDF)
- View application status

### For Employers
- Register and login
- Post job openings
- Edit and delete jobs
- View candidate applications
- Accept or reject applications

## Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication
- Multer (File Upload)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and add your MongoDB connection string:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/jobboard?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Employer only)
- `PUT /api/jobs/:id` - Update job (Employer only)
- `DELETE /api/jobs/:id` - Delete job (Employer only)

### Applications
- `POST /api/applications/apply/:jobId` - Apply for job (Candidate only)
- `GET /api/applications/my-applications` - Get candidate applications
- `GET /api/applications/job/:jobId` - Get applications for job (Employer only)
- `PUT /api/applications/:applicationId/status` - Update application status (Employer only)

## Sample API Requests (Postman)

### Register User
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate"
}
```

### Login
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Job (Employer)
```json
POST http://localhost:5000/api/jobs
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Frontend Developer",
  "description": "We are looking for a skilled Frontend Developer...",
  "skillsRequired": ["React", "JavaScript", "CSS"],
  "experience": "2-3 years",
  "companyName": "Tech Corp"
}
```

## MongoDB Connection Troubleshooting

### Common Issues & Solutions

1. **Connection Timeout**
   - Check your internet connection
   - Verify MongoDB Atlas cluster is running
   - Check IP whitelist in MongoDB Atlas

2. **Authentication Failed**
   - Verify username and password in connection string
   - Check database user permissions

3. **Network Error**
   - Ensure your IP is whitelisted (0.0.0.0/0 for development)
   - Check firewall settings

4. **Database Not Found**
   - MongoDB will create the database automatically on first write
   - Ensure database name in connection string is correct

### Environment Variables
Make sure your `.env` file contains:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/jobboard?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
```

## Project Structure

```
mern-job-board/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── JobDetails.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- File upload validation (PDF only)
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.