# Irene's Circus Backend API

This is the backend API for Irene's Circus website. It provides endpoints for tracks, events, band members, gallery images, and contact form submissions.

## Technology Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Winston for logging

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the project directory:
```bash
cd irenes-circus-backend
```
3. Install dependencies:
```bash
npm install
```
4. Create a `.env` file in the root directory with the following variables (use `env.example` as a template):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/irenes-circus
NODE_ENV=development
LOG_LEVEL=debug
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/:id` - Get track by ID
- `POST /api/tracks` - Create a new track (Admin)
- `PUT /api/tracks/:id` - Update a track (Admin)
- `DELETE /api/tracks/:id` - Delete a track (Admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event (Admin)
- `PUT /api/events/:id` - Update an event (Admin)
- `DELETE /api/events/:id` - Delete an event (Admin)

### Band Members
- `GET /api/band-members` - Get all band members
- `GET /api/band-members/:id` - Get band member by ID
- `POST /api/band-members` - Create a new band member (Admin)
- `PUT /api/band-members/:id` - Update a band member (Admin)
- `DELETE /api/band-members/:id` - Delete a band member (Admin)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `GET /api/gallery/:id` - Get gallery image by ID
- `POST /api/gallery` - Create a new gallery image (Admin)
- `PUT /api/gallery/:id` - Update a gallery image (Admin)
- `DELETE /api/gallery/:id` - Delete a gallery image (Admin)

### Contact
- `POST /api/contact` - Submit a contact form
- `GET /api/contact` - Get all contact submissions (Admin)
- `GET /api/contact/:id` - Get contact submission by ID (Admin)
- `PUT /api/contact/:id/read` - Mark contact as read (Admin)
- `DELETE /api/contact/:id` - Delete a contact submission (Admin)

### Authentication
- `POST /api/auth/register` - Register a new admin user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

## Frontend Integration

The backend is designed to work with the Irene's Circus frontend. Update the frontend API calls to point to these endpoints instead of using static data. 