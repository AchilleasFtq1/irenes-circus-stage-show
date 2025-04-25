# Irene's Circus Website

A theatrical musical experience that combines powerful vocals, dramatic instrumentation, and circus-inspired performance art.

## Project Structure

This project is split into two main parts:

1. **Frontend**: React.js with TypeScript, TailwindCSS, and ShadCN UI components
2. **Backend**: Express.js API with TypeScript, MongoDB, and Mongoose

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud-based)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd irenes-circus-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory (use env.example as a template):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/irenes-circus
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

4. Seed the database with initial data:
   ```
   npm run seed
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Make sure you're in the root directory.

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Access the application at http://localhost:5173

## Features

- Responsive design with mobile and desktop views
- Music player for band tracks
- Tour dates and event listings
- Band member information
- Photo gallery
- Contact form
- Admin dashboard (accessible at /admin)

## Admin Access

To access the admin dashboard, navigate to `/admin/login` and use the following credentials:

- Email: admin@irenescircus.com
- Password: admin123

## Deployment

### Backend Deployment

1. Build the backend for production:
   ```
   cd irenes-circus-backend && npm run build
   ```

2. Deploy the `dist` folder to your server along with:
   - `package.json`
   - `package-lock.json`
   - `.env` file (with production values)

3. Install dependencies and start the server:
   ```
   npm install --production && npm start
   ```

### Frontend Deployment

1. Build the frontend for production:
   ```
   npm run build
   ```

2. Deploy the `dist` folder to your static hosting service.

## License

This project is licensed under the MIT License.
