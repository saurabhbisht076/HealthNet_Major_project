# HealthNet Major Project

## Overview
HealthNet is a modern healthcare management platform designed to connect patients with healthcare providers, streamline appointment scheduling, manage electronic health records, and provide real-time health monitoring.

## Table of Contents
- [Features](#features)
- [System Architecture](#system-architecture)
- [Frontend](#frontend)
  - [Technologies](#frontend-technologies)
  - [Setup](#frontend-setup)
  - [Available Scripts](#frontend-scripts)
- [Backend](#backend)
  - [Technologies](#backend-technologies)
  - [Setup](#backend-setup)
  - [Available Scripts](#backend-scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [License](#license)

## Features

### Patient Features
- User registration and authentication
- Physician search by specialty and location
- Appointment scheduling and management
- Electronic health records access
- Prescription management and refill requests
- Telemedicine integration
- Health metrics tracking
- Secure messaging with providers

### Provider Features
- Provider profiles and schedule management
- Patient record management
- Appointment dashboard
- Prescription management
- Lab result uploads
- Secure communication system
- Analytics dashboard

## System Architecture
- Frontend: React-based SPA with Redux
- Backend: Node.js/Express API server
- Database: MongoDB for patient and provider data
- Authentication: JWT with role-based access
- Storage: Firebase Storage for medical files
- Realtime: WebSockets for messaging

## Frontend

### Technologies
- React
- Redux
- React Router
- Axios
- Firebase Authentication
- Firebase Storage
- Google Maps API
- Chart.js
- Material UI

### Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

### Available Scripts
- `npm start`: Starts the development server
- `npm build`: Creates production build
- `npm test`: Runs the test suite
- `npm run lint`: Runs ESLint checks

## Backend

### Technologies
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Socket.io

### Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

### Available Scripts
- `npm start`: Starts production server
- `npm run dev`: Starts development server with nodemon
- `npm test`: Runs the test suite
- `npm run seed`: Seeds database with initial data

## Environment Variables

### Backend Environment Variables
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=your_mongo_uri

# Authentication
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret

# Email
USER_NAME=your_username
PASSWORD=your_password

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

### Frontend Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

## Deployment

### Production Deployment
- Frontend: AWS S3 with CloudFront CDN
- Backend: AWS EC2 with load balancing
- Database: MongoDB Atlas
- CI/CD: GitHub Actions

### Docker Deployment
```sh
# Build and run with Docker Compose
docker-compose up --build
```

## Security Features
- HIPAA-compliant data handling
- End-to-end encryption for sensitive communications
- Role-based access control
- Audit logs for data access
- Regular security audits

## License
This project is licensed under the MIT License.
