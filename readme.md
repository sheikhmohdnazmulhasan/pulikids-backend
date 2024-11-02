# Pulikids - Child Care Management Platform

Pulikids is a modern child care management platform serving nurseries, schools, and childcare providers across the UK. The system handles booking, activity tracking, compliance monitoring, and parent communications.

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Environment Setup](#environment-setup)
3. [API Documentation](#api-documentation)

## Folder Structure

```
pulikids-backend/
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

   ```bash
   git clone https://github.com/sheikhmohdnazmulhasan/pulikids-backend.git
   cd pulikids-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a .env file in the root directory and add the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongo_db_connection_uri
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   JWT_ACCESS_TOKEN_SECRET=your_jwt_secret_token
   JWT_REFRESH_TOKEN_SECRET=your_jwt_refresh_token
   NODE_MAILER_SENDER_ADDRESS=your_node_mailer_sender_email_address
   NODE_MAILER_SENDER_APP_PASSWORD=your_node_mailer_sender_app_password
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Documentation

### Authentication Service

#### Create Account

- **POST** /api/v1/auth/user/register

  - Request Body:

    ```json
    {
      "firstName": "Nazmul",
      "lastName": "Hasan",
      "email": "user3@example.com",
      "password": "Nazmul@#123421x"
    }
    ```

  - Response:

    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "User registered successfully. Please log in.",
      "data": {
        "user": {
          "firstName": "Nazmul",
          "lastName": "Hasan",
          "email": "user3@example.com",
          "role": "user"
        }
      }
    }
    ```

#### Login

- **POST** /api/v1/auth/user/login

  - Request Body:

    ```json
    {
      "email": "user3@example.com",
      "password": "Nazmul@#123421x"
    }
    ```

  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "User logged in successfully",
      "data": {
        "user": {
          "_id": "6725e4a6c784d468558853ae",
          "name": "Nazmul Hasan",
          "email": "user@example.com",
          "role": "user"
        },
        "token": {
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
      }
    }
    ```

#### Forgot Password

- **POST** /api/v1/auth/user/password-reset-request
  - Request Body:
    ```json
    {
      "email": "user3@example.com"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Password reset email sent. Please check your inbox.",
      "data": {
        "user": {
          "name": "Nazmul Hasan",
          "email": "user3@example.com",
          "role": "user"
        }
      }
    }
    ```

#### Reset Password

- **POST** /api/v1/auth/user/reset-password
  - Request Body:
    ```json
    {
      "token": "28733d3f6f65aa83c157b1e8b9c76c77a99d4035a90898e21827c403b110e799",
      "newPassword": "nAz,ul332324&&"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Password reset successful",
      "data": {
        "user": {
          "name": "Alice Johnson",
          "email": "x.nazmulofficial@gmail.com",
          "role": "user"
        }
      }
    }
    ```

#### Change Password

- **POST** /api/v1/auth/user/change-password
  - Request Body:
    ```json
    {
      "email": "x.nazmulofficial@gmail.com",
      "oldPassword": "nAz,ul332324&&",
      "newPassword": "nAz,ul332324&&zzz"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Password changed successfully. Please login with new password",
      "data": {
        "user": {
          "name": "Nazmul Hasan",
          "email": "user3@example.com",
          "role": "user"
        }
      }
    }
    ```

### Activity Tracking Service

#### Create Activity

- **POST** /api/v1/activities/create-activity
  - Request Body:
    ```json
    {
      "name": "Team Building Workshop",
      "description": "A workshop aimed at improving team dynamics and communication.",
      "date": "2024-11-10",
      "startTime": "09:00",
      "endTime": "17:00",
      "location": "Room 402, Main Office Building"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 201,
      "success": true,
      "message": "Activity successfully created",
      "data": {
        "name": "Team Building Workshop",
        "description": "A workshop aimed at improving team dynamics and communication.",
        "date": "2024-11-10T00:00:00.000Z",
        "startTime": "09:00",
        "endTime": "17:00",
        "location": "Room 402, Main Office Building",
        "createdBy": "6725e4a6c784d468558853ae",
        "_id": "6725e50cc784d468558853b1",
        "createdAt": "2024-11-02T08:38:36.283Z",
        "updatedAt": "2024-11-02T08:38:36.283Z"
      }
    }
    ```

#### Get All Activity

- **GET** /api/v1/activities
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Activities retrieved successfully",
      "data": [
        {
          "_id": "6725e50cc784d468558853b1",
          "name": "Team Building Workshop",
          "description": "A workshop aimed at improving team dynamics and communication.",
          "date": "2024-11-10T00:00:00.000Z",
          "startTime": "09:00",
          "endTime": "17:00",
          "location": "Room 402, Main Office Building",
          "createdBy": {
            "_id": "6725e4a6c784d468558853ae",
            "firstName": "Nazmul",
            "lastName": "Hasan",
            "email": "user@example.com"
          },
          "createdAt": "2024-11-02T08:38:36.283Z",
          "updatedAt": "2024-11-02T08:38:36.283Z"
        }
      ]
      // ... more activities
    }
    ```

#### Get Single Activity

- **GET** /api/v1/activities/:activityId
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Activity retrieved successfully",
      "data": {
        "_id": "6725e50cc784d468558853b1",
        "name": "Team Building Workshop",
        "description": "A workshop aimed at improving team dynamics and communication.",
        "date": "2024-11-10T00:00:00.000Z",
        "startTime": "09:00",
        "endTime": "17:00",
        "location": "Room 402, Main Office Building",
        "createdBy": {
          "_id": "6725e4a6c784d468558853ae",
          "firstName": "Nazmul",
          "lastName": "Hasan",
          "email": "user@example.com"
        },
        "createdAt": "2024-11-02T08:38:36.283Z",
        "updatedAt": "2024-11-02T08:38:36.283Z"
      }
    }
    ```

#### Update Activity

- **PUT** /api/v1/activities/:activityId
  - Request Body:
    ```json
    {
      "name": "Updated Painting Class",
      "description": "Updated fun painting session for kids",
      "date": "2023-06-16",
      "startTime": "15:00",
      "endTime": "17:00",
      "location": "Updated Art Room"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Activity updated successfully",
      "data": {
        "_id": "6725e50cc784d468558853b1",
        "name": "Updated Painting Class",
        "description": "Updated fun painting session for kids.",
        "date": "2023-16-160T00:00:00.000Z",
        "startTime": "15:00",
        "endTime": "17:00",
        "location": "Updated Art Room",
        "createdBy": "6725e4a6c784d468558853ae",
        "createdAt": "2024-11-02T08:38:36.283Z",
        "updatedAt": "2024-11-02T08:40:42.984Z"
      }
    }
    ```

#### Delete Activity

- **DELETE** /api/v1/activities/:activityId
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Activity deleted successfully"
    }
    ```

#### Mark Attendance

- **POST** /api/v1/attendances/create-attendance
  - Request Body:
    ```json
    // If the role is `admin` and `userId` is provided, it uses that; otherwise, it defaults to the user's own ID (`user._id`) from token.
    // "userId" : "67235c65631af1250856e81a",
    {
      "activityId": "672479d291afe5b7db4fb3c9",
      "status": "present"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 201,
      "success": true,
      "message": "Attendance created successfully",
      "data": {
        "activityId": "672479d291afe5b7db4fb3c9",
        "userId": "67238642faffa706b3e29ce6",
        "status": "present",
        "_id": "672609d8570c28f3593a9514",
        "createdAt": "2024-11-02T11:15:36.558Z",
        "updatedAt": "2024-11-02T11:15:36.558Z"
      }
    }
    ```

#### Get All Attendance

- **GET** /api/v1/attendances/

  - Response:

    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Attendances retrieved successfully",
      "data": [
        {
          "_id": "672609d8570c28f3593a9514",
          "activityId": null,
          "userId": null,
          "status": "present",
          "createdAt": "2024-11-02T11:15:36.558Z",
          "updatedAt": "2024-11-02T11:15:36.558Z"
        }

        // more attendances
      ]
    }
    ```

#### Get Activity Attendance

- **GET** /api/v1/attendances/:activityId

  - Response:

    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Activity-based attendances retrieved successfully",
      "data": [
        {
          "_id": "672609d8570c28f3593a9514",
          "activityId": null,
          "userId": null,
          "status": "present",
          "createdAt": "2024-11-02T11:15:36.558Z",
          "updatedAt": "2024-11-02T11:15:36.558Z"
        }

        //more attendances
      ]
    }
    ```

### Booking Service

#### Create Booking

- **POST** /api/v1/bookings/create-booking
  - Request Body:
    ```json
    {
      "activityId": "6725e50cc784d468558853b1",
      "bookingDate": "2024-11-10"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 201,
      "success": true,
      "message": "Your booking has been successfully created.",
      "data": {
        "activityId": {
          "_id": "6725e50cc784d468558853b1",
          "name": "activity name updated",
          "description": "A workshop aimed at improving team dynamics and communication.",
          "location": "Room 402, Main Office Building"
        },
        "userId": {
          "_id": "6725e4a6c784d468558853ae",
          "firstName": "Nazmul",
          "lastName": "Hasan",
          "email": "user3@example.com"
        },
        "status": "pending",
        "bookingDate": "2024-11-10T00:00:00.000Z",
        "_id": "6725e6abc784d468558853c8",
        "createdAt": "2024-11-02T08:45:31.450Z",
        "updatedAt": "2024-11-02T08:45:31.450Z"
      }
    }
    ```

#### Get All Booking

- **GET** /api/v1/bookings/

  - Response:

    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Bookings retrieved successfully",
      "data": [
        {
          "_id": "6725e6abc784d468558853c8",
          "activityId": {
            "_id": "6725e50cc784d468558853b1",
            "name": "activity name updated",
            "description": "A workshop aimed at improving team dynamics and communication.",
            "location": "Room 402, Main Office Building"
          },
          "userId": {
            "_id": "6725e4a6c784d468558853ae",
            "firstName": "Nazmul",
            "lastName": "Hasan",
            "email": "user@example.com"
          },
          "status": "pending",
          "bookingDate": "2024-11-10T00:00:00.000Z",
          "createdAt": "2024-11-02T08:45:31.450Z",
          "updatedAt": "2024-11-02T08:45:31.450Z"
        }
      ]

      //more bookings
    }
    ```

#### Get Single Booking

- **GET** /api/v1/bookings/:bookingId
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Booking retrieved successfully",
      "data": {
        "_id": "6725e6abc784d468558853c8",
        "activityId": {
          "_id": "6725e50cc784d468558853b1",
          "name": "activity name updated",
          "description": "A workshop aimed at improving team dynamics and communication.",
          "location": "Room 402, Main Office Building"
        },
        "userId": {
          "_id": "6725e4a6c784d468558853ae",
          "firstName": "Nazmul",
          "lastName": "Hasan",
          "email": "user3@example.com"
        },
        "status": "pending",
        "bookingDate": "2024-11-10T00:00:00.000Z",
        "createdAt": "2024-11-02T08:45:31.450Z",
        "updatedAt": "2024-11-02T08:45:31.450Z"
      }
    }
    ```

#### Get User Bookings

- **GET** /api/v1/bookings/user/:userId
  - Response:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "User bookings retrieved successfully",
      "data": [
        {
          "_id": "6725e6abc784d468558853c8",
          "activityId": {
            "_id": "6725e50cc784d468558853b1",
            "name": "activity name updated",
            "description": "A workshop aimed at improving team dynamics and communication.",
            "location": "Room 402, Main Office Building"
          },
          "userId": {
            "_id": "6725e4a6c784d468558853ae",
            "firstName": "Nazmul",
            "lastName": "Hasan",
            "email": "user@example.com"
          },
          "status": "pending",
          "bookingDate": "2024-11-10T00:00:00.000Z",
          "createdAt": "2024-11-02T08:45:31.450Z",
          "updatedAt": "2024-11-02T08:45:31.450Z"
        }
      ]
    }
    ```

#### Update Booking Status

- **PATCH** /api/v1/bookings/action/status/:bookingId
  - Request Body:
    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Booking status updated successfully to 'confirmed'.",
      "data": {
        "_id": "6725e6abc784d468558853c8",
        "activityId": {
          "_id": "6725e50cc784d468558853b1",
          "name": "activity name updated",
          "description": "A workshop aimed at improving team dynamics and communication.",
          "location": "Room 402, Main Office Building"
        },
        "userId": {
          "_id": "6725e4a6c784d468558853ae",
          "firstName": "Nazmul",
          "lastName": "Hasan",
          "email": "user3@example.com"
        },
        "status": "confirmed",
        "bookingDate": "2024-11-10T00:00:00.000Z",
        "createdAt": "2024-11-02T08:45:31.450Z",
        "updatedAt": "2024-11-02T11:35:42.812Z"
      }
    }
    ```
  - Response:
    ```json
    {
      "paymentId": "101",
      "message": "Payment processed successfully"
    }
    ```

#### Delete Order

- **DELETE** /api/v1/bookings/action/delete/:orderId

  - Response:

        ```json
        {
          "statusCode": 200,
          "success": true,
          "message": "Booking deleted successfully.",
          "data": null
        }
        ```

    <img src="https://i.ibb.co.com/x803hXH/Screenshot-2024-11-02-200221.png" alt="database er diagram">
