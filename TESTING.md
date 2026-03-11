# How to Test This Application

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas) — connection string in backend `.env`
- Two terminals (one for backend, one for frontend)

---

## 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` if needed. Required at minimum:

- `MONGODB_URI` — MongoDB connection string (e.g. `mongodb://localhost:27017/school-finder`)

Then:

```bash
npm run dev
```

Backend runs at **http://localhost:8000** by default (or `PORT` from `.env`).

**Optional — seed data:**

- Zip centroids (needed for school search by ZIP):
  - Quick (Nevada zips): `npm run seed:zips`
  - Full US (from CSV): `npm run seed:zips:csv`
- Schools (for search results): `npm run seed:schools`
- Admin user: `npm run seed:admin`

---

## 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` (see `frontend/.env.example`):

```env
VITE_BASE_URL=http://localhost:8000/api
```

Use your backend port if different (e.g. 3000).

Then:

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**.

---

## 3. Manual Testing

### School Finder flow

1. Open **http://localhost:5173**
2. Fill the form:
   - First Name, Email (required), ZIP Code (required for school search)
   - Optionally: radius, grade, school type, max cost
3. Click **Find My School**
4. You should land on **http://localhost:5173/schools?zipCode=...&radiusMiles=...**
5. Page should load and call the API; you see either school cards or “No schools found” / an error.

**If you see “ZIP not in database”:** run `npm run seed:zips` or `npm run seed:zips:csv` in the backend.  
**If you see “No schools found”:** run `npm run seed:schools` in the backend so there are schools with `location` near your ZIP.

### Representatives flow

1. On **http://localhost:5173** use the same form (or go to representatives with address params).
2. Submit to go to the representatives results page and confirm representatives load (if your backend/API is set up for that).

### Other pages

- **About, Resources, Voting records (Legislators), etc.** — open from the UI and confirm they load without errors.

---

## 4. API checks (curl)

Replace `8000` with your backend port if different.

**Health:**

```bash
curl http://localhost:8000/api/userSchoolFinder/health
# Expect: {"ok":true}
```

**School search (no auth):**

```bash
curl "http://localhost:8000/api/userSchoolFinder/search?zipCode=89154&radiusMiles=5"
# Expect: {"schools":[...]} (array may be empty if no schools in DB)
```

**Zip centroid (admin route — may require auth):**

```bash
curl http://localhost:8000/api/adminSchoolFinderFeeds/zip-centroids/89154
# With auth: 200 + centroid; without: may be 401
```

---

## 5. Ports summary

| Service   | Default URL                    | Config                |
|----------|---------------------------------|------------------------|
| Backend  | http://localhost:8000           | `backend/.env` `PORT`  |
| Frontend | http://localhost:5173           | Vite default          |
| API base | http://localhost:8000/api       | `frontend/.env` `VITE_BASE_URL` |

Keep `VITE_BASE_URL` pointing at your backend’s `/api` (e.g. `http://localhost:8000/api`) so the frontend can call the School Finder and other APIs correctly.
