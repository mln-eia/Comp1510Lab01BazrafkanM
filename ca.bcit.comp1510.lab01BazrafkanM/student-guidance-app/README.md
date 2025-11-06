# Pathfinder — Student Guidance Dashboard

A modern web app for students who want tailored guidance on potential career paths and programs.

## Features
- **Career Compass Quiz** — A three question personality quiz that surfaces a dominant career theme, previews guidance in-app, and saves personalized recommendations to Firestore.
- **Program Explorer** — Real-time list of study programs filterable by field and region.
- **Smart Program Highlights** — Quiz-aligned programs are automatically spotlighted so students know where to focus first.
- **Career News Feed** — Curated external articles with relative timestamps so students can quickly scan fresh opportunities.
- **Goal Tracker** — Lightweight personal plan with deadlines, completion stats, and toggles to stay on track.
- **Live Profiles** — Student identity settings persist to Firestore, keeping their dashboard synced across devices.

## Tech Stack
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- Modern CSS with the Inter font family

## Getting Started
1. Install dependencies.
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root with your Firebase project credentials. Example:
   ```bash
   VITE_FIREBASE_API_KEY=your-key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-app
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. Start the development server.
   ```bash
   npm run dev
   ```
4. Configure the following Firestore collections with security rules that scope documents by `userId` as needed:
   - `users`
   - `programs`
   - `news`
   - `goals`
   - `quizResults`

The UI listens for live updates so changes appear immediately.

## Firestore Document Shapes
| Collection | Example Fields |
|------------|----------------|
| `users` | `displayName: string`, `createdAt: timestamp` |
| `programs` | `name`, `provider`, `field`, `region`, `summary`, `link` |
| `news` | `title`, `summary`, `source`, `link`, `publishedAt: timestamp` |
| `goals` | `userId`, `title`, `dueDate` (ISO string), `notes`, `completed: boolean` |
| `quizResults` | `userId`, `dominantTheme`, `recommendations: string[]`, `createdAt: timestamp` |

## Production Build
```bash
npm run build
```
The optimized assets will be emitted to `dist/`.
