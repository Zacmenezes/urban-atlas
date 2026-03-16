# UrbanAtlas - Construction License Visualization Platform

A modern monorepo for visualizing construction licenses on a map. Built with **Angular 21** frontend and **FastAPI** backend.

## 📁 Repository Structure

```text
urban-atlas/
├── backend/urban_atlas_api/        # FastAPI backend
├── frontend/urban-atlas-web/       # Angular 21 frontend
├── infrastructure/docker/          # Docker configurations
├── docs/                           # Architecture documentation
├── docker-compose.yml              # Docker compose setup
└── QUICK_START.md                  # Quick setup guide
```

## 🚀 Quick Start

### Option 1: Local Development

**Frontend:**
```bash
cd frontend/urban-atlas-web
npm install
npm start
# Open http://localhost:4200/#/map
```

**Backend:**
```bash
cd backend/urban_atlas_api
pip install -r requirements.txt
python main.py
# API: http://localhost:8000
```

### Option 2: Docker

```bash
docker compose up --build
```

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:4200 | Map visualization |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Swagger documentation |
| Health Check | http://localhost:8000/health | Backend health |

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](./QUICK_START.md)** | Installation, setup, common tasks |
| **[FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md)** | Frontend architecture & design |

## ✨ Frontend Features

- **Angular 21** with standalone components
- **Leaflet Map** - Interactive map centered on Fortaleza, Brazil
- **5 Mocked Markers** - Construction licenses with clickable popups
- **Clean Architecture** - core/shared/features structure
- **Lazy Loading** - Optimized route splitting
- **HTTP Interceptor** - Automatic API base URL prepending
- **CoreUI Shell** - Professional admin template

### Frontend Routes

- `/#/dashboard` - Landing page with quick links
- `/#/map` - Interactive Leaflet map with 5 mocked license markers ⭐
- `/#/licenses` - License list/table view

## 🗺️ Map Features

**Location**: Fortaleza, Brazil  
**Zoom**: 13  
**Markers**: 5 construction licenses  
**Tile Layer**: OpenStreetMap  
**Popups**: Process number & address  

## 🔌 API Integration

**Expected Endpoint**: `GET /licenses`

```json
[
  {
    "id": 1,
    "licenseNumber": "FORT-2026-0001",
    "projectName": "Project Name",
    "district": "District",
    "status": "approved",
    "issuedAt": "2026-03-02",
    "latitude": -3.7272,
    "longitude": -38.5244
  }
]
```

## 📊 Build Status

✅ **Frontend Build**: PASSING  
✅ **Bundle Size**: 1.03 MB (204 kB gzipped)  
✅ **Errors**: 0  
✅ **TypeScript**: Strict mode  

## 🛠️ Technology Stack

**Frontend**
- Angular 21.2.4
- CoreUI 5.6
- Leaflet 1.9+
- RxJS

**Backend**
- FastAPI (Python 3.11+)
- SQLAlchemy ORM
- Alembic migrations

## 🚦 Getting Started

1. **Setup**: See [QUICK_START.md](./QUICK_START.md)
2. **Explore**: Navigate to `/#/map` to see Leaflet map
3. **Develop**: Review [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md)
4. **Integrate**: Implement `/licenses` API endpoint
5. **Deploy**: Run production build

## 📝 Next Steps

- [ ] Backend `/licenses` API implementation
- [ ] Connect frontend to real data
- [ ] Add authentication layer
- [ ] Implement license details modal
- [ ] Add map filtering/search
- [ ] Production deployment

## 📞 Support

- Frontend setup? → [QUICK_START.md](./QUICK_START.md)
- Architecture questions? → [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md)
- Need help? → Check inline code comments

---

**Last Updated**: 2026-03-16  
**Status**: ✅ Ready for development

