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

## API Endpoints

All endpoints are under `/api/`  
Examples below assume `http://localhost:3000/api/`

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