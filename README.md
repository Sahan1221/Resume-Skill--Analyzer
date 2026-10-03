# Resume & Skill Analyzer

A full-stack Resume Skill Analyzer that lets authenticated users upload a PDF resume, select a target role, run structured analysis, review recommendations, and reopen saved analyses from history.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- Database: SQLite + SQLAlchemy
- Authentication: JWT Bearer tokens
- Resume extraction: PyPDF

## Repository structure

```text
backend/
  app/
  tests/
  data/
frontend/
  src/
PROJECT_STATUS.md
.github/workflows/ci.yml
```

## Local setup

### Backend

```bash
cd backend
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API health check: `http://localhost:8000/health`

API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

The frontend defaults to:

`http://localhost:5173`

Set `VITE_API_BASE_URL` when the backend is hosted somewhere other than the local default. See `.env.example`.

## Backend environment

Copy `backend/.env.example` to `backend/.env` and set a strong `JWT_SECRET_KEY` for any non-local environment.

Important settings:

- `MAX_CV_SIZE_MB=5`
- `FRONTEND_ORIGIN=http://localhost:5173`
- `JWT_SECRET_KEY=...`

## Testing

Run the backend suite:

```bash
cd backend
python -m pytest -q
```

The current verified suite contains **69 passing tests**.

Build the frontend:

```bash
cd frontend
npm ci
npm run build
```

The GitHub Actions workflow runs both the backend tests and frontend production build from a clean checkout.

## Application flow

1. Register or log in.
2. Open the protected New Analysis page.
3. Upload a PDF resume no larger than 5 MB.
4. Select a target role.
5. Run the analysis.
6. Review the results tabs.
7. Open Analysis History.
8. Reopen a persisted analysis by its analysis ID.

The original uploaded CV and extracted resume text are intentionally not persisted in the analysis database.

## API error contract

The upload endpoint uses:

- `400` for missing/invalid target-role input or an empty PDF.
- `401` for missing/invalid authentication.
- `404` when a requested analysis does not exist for the authenticated user.
- `413` when a PDF exceeds 5 MB.
- `415` when the upload is not a PDF.
- `422` for resume-analysis validation failures.
- `500` when persistence fails or an unexpected server error occurs.

## Database and deployment note

The current application uses SQLite at `backend/data/resume_analyzer.db`.

For production deployment, the selected hosting environment must provide persistent storage for this database. An ephemeral filesystem can cause users and saved analyses to disappear after restarts or redeployments.

If the chosen platform does not provide reliable persistent SQLite storage, migrate the production database to a managed relational database before release.

## Project status

See [`PROJECT_STATUS.md`](PROJECT_STATUS.md) for the authoritative current state, completed work, remaining validation, CI/CD, deployment, and definition of done.
