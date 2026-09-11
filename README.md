# SchemeSaathi — Government schemes, matched to you.

> **Product Vision:** A simple, high-trust gateway for Indian entrepreneurs to discover government schemes they may be eligible for, understand benefits and criteria in plain language, and click directly to official government portals to complete their applications.
>
> **Core Flow:** Discover → Understand → Match → Redirect to Official Website  
> **Project Location:** `~/Desktop/SIH26092-Scheme-Matcher/`

---

## 1. Key Highlights

- **Zero Login / Signup:** Works immediately for every entrepreneur without accounts, passwords, or authentication friction.
- **Zero Document Uploads:** No Aadhaar, PAN, or certificate uploads required. SchemeSaathi asks only the essential demographic, business, and financial criteria needed to calculate eligibility.
- **20+ Authentic Indian Government Schemes:** Curated catalog across MSME, Food Processing, Agriculture, Handicrafts, and Ministry of Finance programs (PMEGP, Stand-Up India, PM MUDRA, PM-FME, PM Vishwakarma, CGTMSE, etc.).
- **Transparent & Explainable Matching:** Explains exactly why an entrepreneur qualifies ("Why you may qualify") and highlights points to verify ("Important to verify").
- **Prominent Official Redirection:** Every scheme features a clear **"Visit Official Website →"** button directing users to the official nodal portal (e.g. kviconline.gov.in, jansamarth.in, standupmitra.in, pmfme.mofpi.gov.in).
- **Try Demo Mode:** One-click persona loading for judges (Ravi Kumar: OBC, Food Processing, Nashik Rural, ₹5 Lakhs equipment funding).
- **SchemeSaathi AI Assistant:** Floating conversational helper focused exclusively on government scheme discovery.

---

## 2. Quick Start

### ⚡ Option 1: Double-Click Launcher (macOS)
Double-click:
```bash
START_APP.command
```
*(Also available directly on your Desktop as `~/Desktop/START_SCHEME_MATCHER.command`)*

This launches:
1. **Backend (FastAPI)** on `http://127.0.0.1:8000`
2. **Frontend (Vite + React)** on `http://localhost:5173`
3. Automatically opens your default web browser to the homepage.

---

### 💻 Option 2: Manual Terminal Commands

#### Terminal 1 — Backend:
```bash
cd ~/Desktop/SIH26092-Scheme-Matcher/backend
source venv/bin/activate
python3 -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
- API Health: `http://127.0.0.1:8000/api/health`
- Interactive API Docs: `http://127.0.0.1:8000/docs`

#### Terminal 2 — Frontend:
```bash
cd ~/Desktop/SIH26092-Scheme-Matcher/frontend
npm run dev
```
- Frontend Web App: `http://localhost:5173`

---

## 3. Demo Walkthrough for Evaluators

1. Open `http://localhost:5173`.
2. Click **"⚡ Try Demo (Ravi Kumar)"** on the Hero or **"⚡ Try Demo"** in the navigation bar.
3. The eligibility form automatically populates with Ravi Kumar's profile:
   - State: Maharashtra, District: Nashik
   - Category: OBC, Income: ₹3,20,000
   - Sector: Food Processing, 2 years operating, 4 employees
   - Funding: ₹5,00,000 for Equipment Purchase
4. Click **"Find My Schemes"**.
5. The matching engine evaluates 20 schemes and returns ranked recommendations:
   - **PM-FME (98% Match)**
   - **PMEGP (94% Match)**
   - **Mudra Kishore (98% Match)**
6. Click **"View Scheme"** on any card to review:
   - **Why You May Qualify:** State, category, income, and business sector matches.
   - **Important to Verify:** Note on checking latest official guidelines.
   - **Benefits & Criteria:** Support details, funding caps, and typical document reference checklist.
7. Click **"Visit Official Website →"** to navigate directly to the verified government portal.

---

## 4. Architecture & Technical Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Lucide Icons
- **Backend:** Python FastAPI (REST APIs, CORS enabled)
- **Database:** Local SQLite database (`backend/database/schemes.db`)
- **Matching Engine:** Configurable weighted matching algorithm (`backend/services/matcher.py`)
- **Chatbot:** Knowledge-based assistant with optional Gemini/OpenAI API fallback (`backend/services/chatbot.py`)

---

## 5. Stopping the Application

Press `Ctrl + C` in the terminal running the servers, or execute:
```bash
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
```
