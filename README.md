# Activity Booking API

A simple RESTful API built with Next.js (App Router) and Supabase to manage activities and bookings.  
Authenticate, view available activities, and book your spot—all with robust transactional logic and Supabase Auth.

---

## Features

- **User Authentication** (Sign up & Login)
- **View Activities** (with available slots)
- **Book Activities** (slots decrease automatically, no overbooking)
- **View Your Bookings**
- **Secure, Transactional Backend** (using Supabase/Postgres functions)
- **Easy to test** (Postman collection compatible)

---

## Tech Stack

- **Next.js** (App directory routing, pure JavaScript)
- **Supabase** (Postgres, Auth, API)
- **RESTful endpoints**

---

## Live Demo

Access the deployed API and app here:  
**[https://cvnt-assignmnet.vercel.app/](https://cvnt-assignmnet.vercel.app/)**

---

## API Endpoints

All endpoints are under `/api/`  
Examples below assume `https://cvnt-assignmnet.vercel.app/api/`

### **Auth**

#### `POST /signup`
Create a new user.
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### `POST /login`
Login and get access token.
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
Returns:  
```json
{
  "user": { ... },
  "session": {
    "access_token": "..."
  }
}
```

---

### **Activities**

#### `GET /activities`
Get all activities with available slots.

Supports **pagination and filtering** via query parameters:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)
- `title`: Filter by activity title (optional, partial match)
- `location`: Filter by activity location (optional, partial match)

Example:
```
GET /activities?page=2&limit=5&title=yoga&location=delhi
```
Returns:
```json
{
  "activities": [ ... ],
  "total": 37,
  "page": 2,
  "limit": 5,
  "pages": 8
}
```

#### `GET /activities/:id`
Get single activity by ID.

---

### **Bookings**

#### `POST /book`
Book an activity (authenticated route).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "activity_id": "<activity_uuid>"
}
```
**Returns:**  
`{ "message": "Booking successful!" }` or error message.

---

#### `GET /my-bookings`
Get all bookings for the logged-in user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Returns:**
```json
[
  {
    "id": "...",
    "activity_id": "...",
    "timestamp": "...",
    "activities": {
      "title": "...",
      "location": "..."
    }
  }
]
```