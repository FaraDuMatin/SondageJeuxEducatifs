# Sondage Jeux Educatifs

Survey app for collecting and managing feedback on educational games. Built with Next.js (App Router) and Turso (libSQL). The UI follows the Bauhaus / neo-brutalist design rules in [DESIGN.md](DESIGN.md).

## Routes

- `/` Survey form (reads questions from Turso, stores answers)
- `/admin/questions` Admin UI to add, edit, and delete questions
- `/results` Readable results dashboard

## Data Model (Turso)

The schema is created automatically on first request.

- `questions`: core survey questions
- `question_options`: options for multiple-choice questions
- `answers`: stored responses

## Environment Variables

The app reads either standard Turso variables or the Vite-prefixed ones already in your `.env`.

Required:

- `TURSO_DATABASE_URL` or `VITE_TURSO_URL`
- `TURSO_AUTH_TOKEN` or `VITE_TURSO_TOKEN`
- `ADMIN_PASSWORD` (required to access `/admin/questions` and `/results`)

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 to fill the survey. Use `/admin/questions` to manage questions and `/results` to review answers.

## Notes

- Admin routes are not protected yet.
- Multiple-choice questions support an "Autre" option with a free-text field.
