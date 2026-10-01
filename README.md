# radiusly.

**Real-Time Spatial Telemetry & Geofence Event Detection**

radiusly is a full-stack platform for tracking devices and detecting when they enter or leave geofenced areas. It receives GPS coordinates, evaluates them against circular and polygonal boundaries, and records state changes as `ENTER` and `EXIT` events.

## Features

- Real-time GPS ping ingestion and geofence evaluation
- Circular geofences evaluated with the Haversine formula
- Polygon geofences evaluated with ray casting
- Stateful transition detection to avoid duplicate events
- Dashboard with telemetry analytics and recent activity
- Interactive map with geofence visualization
- CRUD interfaces for geofences, devices, and users
- GPS ping simulator for testing
- Event audit log with timestamps displayed in Indian Standard Time
- Docker Compose setup for the full stack

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12, FastAPI, Uvicorn |
| Validation and ORM | Pydantic v2, SQLAlchemy 2.0 |
| Database | MySQL 8.0 |
| Frontend | React 18, TypeScript, Vite |
| UI and charts | Material UI, Recharts |
| Maps | Leaflet, React-Leaflet |
| Infrastructure | Docker, Docker Compose |

## How It Works

A device sends its ID and GPS coordinates to the API. The backend checks the location against every enabled geofence and compares the result with the device’s previous state in each zone.

| Previous state | Current state | Result |
|---|---|---|
| Outside or no history | Inside | Records `ENTER` |
| Inside | Inside | No event |
| Inside | Outside | Records `EXIT` |
| Outside | Outside | No event |

Each ping is evaluated against all enabled geofences. A single ping can therefore produce multiple events—for example, an `EXIT` from one zone and an `ENTER` into another.

### Circle Geofences

A circle is defined by a center coordinate and a radius in meters. The backend uses the Haversine formula to calculate the distance between the device and the center. The device is inside when the distance is less than or equal to the radius.

### Polygon Geofences

A polygon is defined by three or more ordered latitude/longitude points. The backend uses the ray-casting algorithm to determine whether a coordinate is inside the polygon.

## Application Pages

- **Live Telemetry (`/`)** — KPI cards, charts, recent activity, and the GPS ping simulator.
- **Map View (`/map`)** — Interactive map showing circular and polygonal geofences.
- **Geofence Rules (`/geofences`)** — Create, edit, enable, disable, and delete boundaries.
- **Device Fleet (`/devices`)** — Register and manage tracked devices.
- **User Directory (`/users`)** — View and manage operator profiles.
- **Event Audit Logs (`/logs`)** — Review recorded `ENTER` and `EXIT` events.

## Getting Started

### Run with Docker Compose

From the project root, run:

```bash
docker compose up -d --build
```

Once the services are running, open:

- **Dashboard:** http://localhost:5173
- **API health check:** http://localhost:8000/
- **Interactive API docs:** http://localhost:8000/docs

### Useful Commands

View API logs:

```bash
docker logs geofence_api
```

Stop the services:

```bash
docker compose down
```

Rebuild without using cached layers:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

Run the API locally while keeping MySQL in Docker:

```bash
docker stop geofence_api
cd backend
uvicorn app.main:app --reload --port 8000
```

## Docker Services

Docker Compose runs three services:

- **MySQL** — MySQL 8.0 database with persistent storage.
- **API** — FastAPI backend available on port `8000`.
- **Frontend** — Vite development server available on port `5173`.

The database is available on host port `3307` and container port `3306`. The API connects to MySQL over the Docker network.

## Configuration Notes

The Docker Compose configuration provides database credentials for local development. Change these values before using the project in a production environment.

The dashboard includes an operator context switcher for demonstration and testing. It does not provide authentication or authorization. Production deployments should secure the application and telemetry endpoints using an appropriate authentication layer.