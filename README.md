# EduWatch Full-Stack

Academic Performance & Early Warning System built with HTML, CSS, Bootstrap, browser JavaScript, Node.js, Express.js, MongoDB and Mongoose.

## Features
- Dashboard with student counts, risk distribution, average attendance and open interventions
- Student create, read, update and delete
- Search students and filter by risk level
- Rule-based risk calculation with clear demo thresholds
- Student detail view with supportive recommendations
- Create, update status and delete interventions
- Responsive Bootstrap layout

## Requirements
- Node.js (LTS recommended)
- MongoDB Community Server running locally OR a MongoDB Atlas connection string
- VS Code (recommended)

## Setup
1. Open this folder in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure MongoDB is running locally. The default connection is `mongodb://127.0.0.1:27017/eduwatch`.
4. Check `.env` and set `MONGODB_URI` if you use MongoDB Atlas.
5. Start the server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:5000` in your browser.

## API endpoints
- `GET /api/health`
- `GET /api/students`
- `GET /api/students?search=ana&risk=High`
- `POST /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`
- `GET /api/interventions`
- `POST /api/interventions`
- `PUT /api/interventions/:id`
- `DELETE /api/interventions/:id`

## Demo risk rules
- High: attendance below 60% OR marks below 40
- Medium: otherwise, attendance below 75% OR marks below 60
- Low: otherwise

These thresholds are illustrative rules for a project demo, not a validated prediction model. Do not use them to make high-impact decisions about real students without validation, oversight and appropriate privacy protections.

## Notes
- The database starts empty; add students from the UI.
- Bootstrap and Bootstrap Icons are loaded from a CDN, so the browser needs internet access for those assets.
- This starter project does not include authentication or role-based access. Add those before using real student records.


## Role-based login (demo)
- The welcome page offers Student and Faculty login choices.
- Student login checks the entered roll number against the `studentId` in MongoDB.
- Faculty login checks a User ID in the `faculties` collection.
- Add student records in the faculty workspace before students can log in.
- Seed a demo faculty account by running `npm run seed:faculty` while MongoDB is running. Default demo ID: `FACULTY001` (or set `DEMO_FACULTY_USER_ID` in `.env` before seeding).
- Student dashboard displays attendance, marks, risk level, suggestions and any faculty intervention records.

**Security note:** this is a hackathon/demo implementation. User-ID-only faculty login is not secure authentication, and the existing data-management API routes are not protected by role-based server authorization. Do not use it with real student data until passwords, sessions/tokens, authorization and appropriate privacy controls are implemented.
