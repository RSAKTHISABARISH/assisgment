# AI MCQ Test Monitoring Platform (Supabase Edition)

A modern, futuristic online examination platform with AI-powered question generation, real-time student monitoring, and advanced analytics.

## Features
- **AI MCQ Generation**: Enter a topic, and OpenAI generates 10 beginner-level questions.
- **Dual Login**: Secure Admin and Student portals.
- **Advanced UI**: Glassmorphism, smooth animations (Framer Motion), and responsive design.
- **Database**: Powered by **Supabase** (PostgreSQL) for reliable data storage.
- **Anti-Cheating**: Tab-switch detection and full-screen enforcement.
- **Admin Analytics**: Pie charts, bar graphs, average scores, and weak topic identification.
- **Data Export**: Export student records as PDF or Excel.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
- **Backend**: Node.js, Express.js, Supabase JS Client.
- **Database**: Supabase.
- **AI**: OpenAI API (GPT-4o-mini).

## Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** and run the contents of [schema.sql](file:///c:/Users/sri27/Desktop/mcq/server/schema.sql).
3. Copy your **Project URL** and **Anon Key** from Project Settings -> API.
4. Update the `server/.env` file with these values.

### 2. Backend Setup
1. Open a terminal in the `server` directory.
2. Run `npm install`.
3. Seed the admin user:
   ```bash
   npm run seed
   ```
   *Default Credentials:*
   - Username: `admin`
   - Password: `admin123`
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a terminal in the `client` directory.
2. Run `npm install`.
3. Start the React app:
   ```bash
   npm run dev
   ```

## Running the App
The app will be available at `http://localhost:5173`. 
Ensure the backend is running on `http://localhost:5000`.

---
Created by Antigravity AI
