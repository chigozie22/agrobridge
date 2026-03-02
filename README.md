# AgroBridge - Smart Food Aggregation Platform

## Overview
AgroBridge is an intelligent food aggregation and logistics system that helps people buy food at lower prices by combining orders within densely populated clusters, matching each item to the cheapest verified sellers, and delivering everything together.

**Powered by AJ-Fresh Farmfoods**

## Tech Stack

### Backend
- Python 3.11+
- Django 5.0+ with Django REST Framework
- PostgreSQL 15+
- Redis for caching
- Celery for background tasks

### Frontend
- React 18+ with TypeScript
- Next.js 14+
- Tailwind CSS
- Shadcn/ui components

### Infrastructure
- Docker & Docker Compose
- AWS/Google Cloud ready
- CI/CD with GitHub Actions

## Quick Start

### Prerequisites
- Docker Desktop installed
- Git installed

### One-Command Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd agrobridge

# Start everything with Docker
docker-compose up --build
```

### Access the Application

- **Frontend (Landing Page)**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/docs

### Default Admin Credentials
- Username: `admin`
- Password: `admin123` (Change immediately in production!)

## Project Structure

```
agrobridge/
├── backend/              # Django API backend
│   ├── config/          # Django settings
│   ├── apps/            # Django applications
│   │   ├── users/       # User management
│   │   ├── clusters/    # Cluster management
│   │   ├── products/    # Product catalog
│   │   ├── orders/      # Order processing
│   │   ├── vendors/     # Vendor management
│   │   └── deliveries/  # Delivery coordination
│   └── requirements.txt # Dependencies
│
├── frontend/            # Next.js application
│   ├── src/
│   │   ├── app/         # Next.js app directory
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities
│   └── package.json
│
├── docs/                # Documentation
├── infrastructure/      # Infrastructure configs
└── docker-compose.yml   # Local dev orchestration
```

## Environment Variables

Create `.env` files:

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=django-insecure-development-key-change-in-production
DATABASE_URL=postgresql://postgres:postgres@db:5432/agrobridge
REDIS_URL=redis://redis:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Order details
- `PATCH /api/orders/{id}/status` - Update status

### Clusters
- `GET /api/clusters` - List clusters

## Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## License
Proprietary - AJ-Fresh Farmfoods
