# Resume & Skill Analyzer — Backend

FastAPI backend for the Resume & Skill Analyzer V1.

## Milestone 1
- Health endpoint
- CORS configuration
- CV PDF/type/size validation
- Target-role validation
- Initial analysis API contract
- Original CV is not persisted

## Run

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs
