# Pulikids - Child Care Management Platform

Pulikids is a modern child care management platform serving nurseries, schools, and childcare providers across the UK. The system handles booking, activity tracking, compliance monitoring, and parent communications.

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Environment Setup](#environment-setup)
3. [API Documentation](#api-documentation)
4. [Test Cases](#test-cases)

## Folder Structure

```
pulikids/
│
├── src/
│   ├── users/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── activities/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── bookings/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── common/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   │
│   └── app.ts
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Setup

1. Clone the repository:

   ```
   git clone https://github.com/pulikids/childcare-platform.git
   cd childcare-platform
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/pulikids
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication Service

#### Forgot Password

- **POST** `/auth/forgot-password`
  - Request Body: `{ "email": "user@example.com" }`
  - Response: `{ "message": "Password reset email sent" }`

#### Reset Password

- **POST** `/auth/reset-password`
  - Request Body: `{ "token": "reset_token", "newPassword": "new_password" }`
  - Response: `{ "message": "Password reset successful" }`

#### Change Password

- **POST** `/auth/change-password`
  - Request Body: `{ "currentPassword": "current_password", "newPassword": "new_password" }`
  - Response: `{ "message": "Password changed successfully" }`

### Activity Tracking Service

#### Create Activity

- **POST** `/activities`
  - Request Body:
    ```json
    {
      "name": "Painting Class",
      "description": "Fun painting session for kids",
      "date": "2023-06-15",
      "startTime": "14:00",
      "endTime": "16:00",
      "location": "Art Room"
    }
    ```
  - Response: `{ "activityId": "123", "message": "Activity created successfully" }`

#### Get Activity

- **GET** `/activities/:activityId`
  - Response: Activity details

#### Update Activity

- **PUT** `/activities/:activityId`
  - Request Body: Updated activity details
  - Response: `{ "message": "Activity updated successfully" }`

#### Delete Activity

- **DELETE** `/activities/:activityId`
  - Response: `{ "message": "Activity deleted successfully" }`

#### Mark Attendance

- **POST** `/attendance`
  - Request Body: `{ "activityId": "123", "userId": "456", "status": "Present" }`
  - Response: `{ "message": "Attendance marked successfully" }`

#### Get Activity Attendance

- **GET** `/activities/:activityId/attendance`
  - Response: List of attendance records for the activity

#### Generate Activity Report

- **GET** `/activities/report`
  - Query Parameters: `startDate`, `endDate`
  - Response: Activity and attendance report data

### Booking Service

#### Create Booking

- **POST** `/bookings`
  - Request Body: `{ "activityId": "123", "userId": "456" }`
  - Response: `{ "bookingId": "789", "message": "Booking created successfully" }`

#### Get Booking

- **GET** `/bookings/:bookingId`
  - Response: Booking details

#### Confirm Booking

- **PUT** `/bookings/:bookingId/confirm`
  - Response: `{ "message": "Booking confirmed successfully" }`

#### Cancel Booking

- **DELETE** `/bookings/:bookingId`
  - Response: `{ "message": "Booking cancelled successfully" }`

#### Process Payment

- **POST** `/payments`
  - Request Body: `{ "bookingId": "789", "amount": 50.00 }`
  - Response: `{ "paymentId": "101", "message": "Payment processed successfully" }`

#### Get User Bookings

- **GET** `/bookings/:userId`
  - Response: List of bookings for the user

## Test Cases

### Unit Tests

1. Authentication Service

   - Test password reset token generation
   - Test password hashing and comparison
   - Test email sending functionality

2. Activity Tracking Service

   - Test activity creation with valid and invalid data
   - Test activity update permissions
   - Test attendance marking logic

3. Booking Service
   - Test booking creation with available and unavailable slots
   - Test payment processing
   - Test booking confirmation and cancellation logic
