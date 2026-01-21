from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
import io
import json

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/match")
async def match_resume(file: UploadFile = File(...)):
    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))

    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    text = text.lower()

    skills_list = ["python", "java", "html", "css", "javascript", "data", "web"]
    found_skills = [s for s in skills_list if s in text]

    with open("internships.json", "r") as f:
        internships = json.load(f)

    results = []
    for i in internships:
        matched = list(set(found_skills) & set(i["skills"]))
        if matched:
            i["matched_skills"] = matched
            i["match_score"] = len(matched)
            i["match_percent"] = int((len(matched) / len(i["skills"])) * 100)
            results.append(i)

    return {
        "skills_found": found_skills,
        "recommended_internships": results
    }
