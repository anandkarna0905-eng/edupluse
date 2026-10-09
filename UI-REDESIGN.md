# EduWatch UI Redesign

This update refreshes the existing HTML/CSS/JavaScript UI while keeping the Express routes, MongoDB models, student CRUD, risk calculation, intervention planner, and role-based login code in place.

## Files changed
- `public/css/style.css` — added a Modern SaaS design layer: navy sidebar, white elevated cards, purple/blue accents, refined forms/tables, mobile improvements, hover states, and reduced-motion support.
- `public/index.html` — updated page title and metadata; loaded GSAP and the new optional UI micro-interaction script. Existing IDs and page structure are preserved for compatibility.
- `public/js/ui.js` — optional GSAP entrance animations and subtle button feedback. It does not replace or modify login/API/dashboard handlers.

## Run it
1. Back up your current project folder.
2. Extract this ZIP and open `eduwatch-fullstack` in VS Code.
3. If you are updating an existing copy, replace only the three files listed above; keep the rest of your project and `.env` unchanged.
4. Run `npm install` if dependencies are not installed.
5. Start MongoDB, then run `npm run dev`.
6. Open `http://localhost:5000` and test landing page, both login paths, student dashboard, faculty overview, student directory, and interventions.

GSAP is loaded from a CDN for optional animation. If it is unavailable, the site still works and the CSS transitions remain. Users with reduced-motion enabled receive reduced animations.

## Compatibility note
The original DOM IDs and JavaScript files (`app.js`, `students.js`, `interventions.js`, and `auth.js`) are preserved. This update is intended as a visual refresh, not a backend/authentication rewrite. The current ID-only login flow remains demo-level and should not be used with real student data without proper authentication and access controls.
