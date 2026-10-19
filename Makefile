setup:
	cd backend && pip install -r requirements.txt
test:
	cd backend && python -m pytest -v
run:
	cd backend && uvicorn app.main:app --reload
