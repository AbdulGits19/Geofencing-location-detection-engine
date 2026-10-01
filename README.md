# radiusly.

**Real-Time Spatial Telemetry & Geofence Event Detection Engine**

**radiusly.** is a full-stack spatial telemetry management platform and geofence boundary enforcement engine built with **FastAPI**, **React (TypeScript + Material UI)**, **MySQL 8.0**, and **Docker**. Designed with a minimalist slate-and-amber architectural interface, it ingests real-time GPS coordinate streams, evaluates spatial intersections against circular and polygonal perimeters using pure mathematical geometry, and records stateful boundary transitions (`ENTER`, `EXIT`) in an immutable audit ledger.

---

## Features

- **Real-Time Telemetry Ingestion:** High-throughput GPS coordinate evaluation against all active spatial rules (`is_enabled = True`).
- **Haversine Circle Evaluation:** Great-circle distance math in meters for center-and-radius geofences.
- **Ray-Casting Polygon Evaluation:** Multi-vertex perimeter intersection math for irregular campuses and tech parks.
- **Stateful Transition Engine:** Compares current coordinates against prior device state to eliminate duplicate alerts (`ENTER`, `EXIT`, or `[]`).
- **Multi-Zone Teleportation Support:** Evaluates all enabled zones in a single pass, simultaneously logging an `EXIT` from a previous zone and an `ENTER` into a new zone when a device jumps across boundaries.
- **Live Telemetry Dashboard:** Executive KPI cards, Recharts analytics (*System Composition* & *Boundary Status*), a live activity stream, and an embedded **GPS Ping Simulator**.
- **Interactive Spatial Map:** Leaflet / OpenStreetMap vector canvas rendering circular radii and polygonal boundaries across India.
- **Full CRUD Provisioning:** Administrative interfaces and creation modals for Geofences, Device Fleet (`DEV-XXXX`), and User Directory (`USR-XXXX`).
- **Timezone-Normalized Audit Ledger:** Automatic UTC-to-IST (`Asia/Kolkata`, UTC+5:30) timestamp normalization across all event logs.
- **Full-Stack Containerization:** Three-container Docker Compose orchestration with isolated database networking and persistent volume storage.

---

## Tech Stack

| Layer | Technology | Role in Architecture |
| :--- | :--- | :--- |
| **Backend API** | Python 3.12, FastAPI, Uvicorn | Asynchronous REST endpoints, CORS middleware, and spatial evaluation loop |
| **ORM & Validation** | SQLAlchemy 2.0, Pydantic v2 | Relational schema mapping, connection pooling, and payload serialization |
| **Database** | MySQL 8.0 (`pymysql`) | Persistent relational storage for users, devices, vertices, and audit logs |
| **Frontend UI** | React 18, TypeScript, Vite | Single-Page Application (SPA), state management, and optimistic UI updates |
| **UI & Analytics** | Material UI (MUI), Recharts | Architectural theme (`#FAF8F0` canvas, `#FFBB2D` amber, `#0f172a` slate) & charts |
| **Spatial Maps** | Leaflet, React-Leaflet | Interactive vector map rendering for circular and polygonal boundaries |
| **Infrastructure** | Docker, Docker Compose | Multi-container orchestration (`geofence_mysql`, `geofence_api`, `geofence_frontend`) |

---

## How It Works

### 1. End-to-End Telemetry Workflow
1. **Boundary Provisioning:** Operators define circular (`center + radius`) or polygonal (`3+ sequential vertices`) boundaries stored across `geofences` and `geofence_points`.
2. **Coordinate Ingestion:** A tracked hardware endpoint transmits its `device_id`, `latitude`, and `longitude` to `POST /locations/`.
3. **In-Memory Geometric Evaluation:** The backend checks the coordinate against every enabled geofence (`is_enabled = True`) directly in the Python application layer without requiring heavy GIS database extensions.
4. **State Comparison & Logging:** The engine queries the device's most recent transition in `geofence_events` for each zone and commits a new record strictly when a perimeter is crossed.

### 2. Spatial Mathematics

#### Circle Geofences (Haversine Formula)
A circle is defined by a center coordinate (`sequence = 1`) and a `radius` in meters. The backend computes the great-circle distance $d$ between the device $(\phi_1, \lambda_1)$ and the zone center $(\phi_2, \lambda_2)$ on Earth's radius ($R \approx 6,371,000\text{ m}$):

$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta\lambda}{2}\right), \quad d = 2R \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$

The device evaluates as **Inside** when $d \le \text{radius}$.

#### Polygon Geofences (Ray-Casting Algorithm)
A polygon is defined by three or more ordered latitude/longitude vertices (`sequence = 1..N`). The backend casts a horizontal ray eastward from the device's coordinate and counts how many polygon edges it intersects:
- **Odd intersections:** **Inside** the polygon.
- **Even intersections:** **Outside** the polygon.

### 3. Stateful Transition Matrix (`ENTER`, `EXIT`, `[]`)
To prevent alert fatigue and false `EXIT` triggers on initial boot, transitions are recorded strictly on verified perimeter crossings:

| Previous State in Zone | Current Evaluation | Engine Action | API Response Payload |
| :--- | :--- | :--- | :--- |
| **No prior history** (`None`) | **Outside** | Device initialized outside zone — no action | `[]` (Empty array — ping logged, no transition) |
| **No prior history** (`None`) | **Inside** | Records initial `ENTER` in `geofence_events` | `[{"event_type": "ENTER", "geofence_id": X, ...}]` |
| **Outside** (last event `EXIT`) | **Inside** | Records `ENTER` in `geofence_events` | `[{"event_type": "ENTER", "geofence_id": X, ...}]` |
| **Inside** (last event `ENTER`) | **Inside** | No state change (stationary inside) | `[]` (Empty array — ping logged, no transition) |
| **Inside** (last event `ENTER`) | **Outside** | Records `EXIT` in `geofence_events` | `[{"event_type": "EXIT", "geofence_id": X, ...}]` |
| **Outside** (last event `EXIT`) | **Outside** | No state change (stationary outside) | `[]` (Empty array — ping logged, no transition) |

---

## Application Pages

- **Live Telemetry (`/`)** — KPI metric cards (*Total Geofences*, *Active Boundaries*, *Tracked Devices*, *Logged Transitions*), *System Composition* bar chart, *Boundary Status* donut chart, live activity stream, and the **Telemetry Ping Simulator**.
- **Map View (`/map`)** — Full-viewport interactive Leaflet map rendering active circular radii and polygon vertices.
- **Geofence Rules (`/geofences`)** — Manage spatial boundaries with optimistic active/inactive toggle switches, deletion controls, and the **+ New Boundary** modal (supports dynamic Circle and multi-vertex Polygon creation).
- **Device Fleet (`/devices`)** — Hardware tracker registry mapping `DEV-XXXX` endpoints to assigned operators (`USR-XXXX`) with the **+ Register Device** modal.
- **User Directory (`/users`)** — Operator roster displaying role badges (`Lead Admin`, `Operator`) and the **+ Add User** modal.
- **Event Audit Logs (`/logs`)** — Immutable chronological ledger of all `ENTER` and `EXIT` transitions formatted in `Asia/Kolkata` time.

---

## Getting Started

You can run **radiusly.** either as a fully containerized 3-service Docker stack or locally using Python `venv` and `npm`.

### Option A: Run Full Stack with Docker Compose (Recommended)

From the project root, build and start all three services in detached mode:

```powershell
# 1. Clone the repository
git clone [https://github.com/](https://github.com/)<your-username>/FastAPI-Geofence-Event-Detection-System.git
cd FastAPI-Geofence-Event-Detection-System

# 2. Build and launch all containers (MySQL, FastAPI, React)
docker compose up -d --build

```

#### Useful Docker Commands

```powershell
# View real-time FastAPI logs and SQLAlchemy queries
docker logs geofence_api

# Stop and remove containers
docker compose down

# Force a clean rebuild without cached layers
docker compose down
docker compose build --no-cache
docker compose up -d

```

---

### Option B: Local Manual Setup (Backend `venv` + Frontend `npm`)

#### 1. Database Setup

Start the isolated MySQL 8.0 container (or use a local MySQL server):

```powershell
docker compose up -d db

```

Ensure your root `.env` file points to the exposed host port (`3307`) when running the API outside Docker, or `geofence_mysql:3306` when running inside Docker:

```env
DATABASE_URL=mysql+pymysql://geo_user:geopassword@localhost:3307/geofence_db

```

#### 2. Backend Setup (`FastAPI`)

*(If `geofence_api` is currently running in Docker, stop it first via `docker stop geofence_api` so port `8000` is free.)*

```powershell
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment (Windows PowerShell)
.\venv\Scripts\activate
# (On macOS/Linux: source venv/bin/activate)

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server with hot-reload
uvicorn app.main:app --reload --port 8000

```

#### 3. Frontend Setup (`React + Vite`)

Open a second terminal window:

```powershell
cd frontend

# Install Node packages
npm install

# Start the Vite development server
npm run dev

```

---

## Access Endpoints

* **Frontend Dashboard:** http://localhost:5173
* **API Health Check:** http://localhost:8000/
* **Interactive Swagger Docs:** http://localhost:8000/docs

---

## Docker Architecture & Configuration Notes

### Container Services

* **`geofence_mysql` (`mysql:8.0`):** Isolated relational database backed by the persistent `mysql_data` volume. Listens on internal Docker port `3306` and maps to host port **`3307:3306`** to prevent port collisions with local MySQL installations.
* **`geofence_api` (`./backend`):** FastAPI server on port **`8000:8000`**. Connects to MySQL over the internal Docker bridge network (`geofence_mysql:3306`) and whitelists `http://localhost:5173` and `http://127.0.0.1:5173` via `CORSMiddleware`.
* **`geofence_frontend` (`./frontend`):** Node 20 Alpine container serving the Vite UI on port **`5173:5173`**, optimized with `.dockerignore` and `CHOKIDAR_USEPOLLING=true` for instant hot-reloading.

### Architectural Decisions (Auth & Credentials)

* **Why No Auth Route:** **radiusly.** is architected as an internal VPC control plane and Machine-to-Machine (M2M) telemetry ingestion engine where hardware trackers authenticate upstream at the gateway layer. Omitting heavy session/JWT middleware from the spatial evaluation microservice eliminates serialization overhead on high-frequency GPS pings.
* **Operator Context Switcher & Hardcoded Credentials:** The top navigation bar includes a live operator switcher (`Abdul (Admin)`, `Prasad`, `Matthews`) and `docker-compose.yml` ships with pre-configured development credentials (`geo_user` / `geopassword`). This guarantees zero-friction testing, immediate access to the Telemetry Ping Simulator, and a 100% reproducible Docker bootstrap. For public production deployments, replace the default credentials via environment secrets and place the control plane behind an API gateway or OAuth proxy.