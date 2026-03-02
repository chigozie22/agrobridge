# AgroBridge - Complete Setup Guide

## What You Have

✅ **Complete Backend** (Django + PostgreSQL + Redis + Celery)
✅ **Complete Frontend** (Next.js 14 + TypeScript + Tailwind CSS)
✅ **Docker Configuration** (One-command startup)
✅ **Database Models** (All tables from your schema)
✅ **Authentication System** (JWT-based login/register)
✅ **API Endpoints** (RESTful APIs for all features)
✅ **Landing Page** (Based on your design specifications)

## Quick Start (3 Steps)

### Step 1: Install Docker Desktop
Download and install Docker Desktop:
- **Windows/Mac**: https://www.docker.com/products/docker-desktop
- **Linux**: Follow instructions at https://docs.docker.com/engine/install/

### Step 2: Clone and Start

```bash
# Clone your repository
cd agrobridge

# Start everything
docker-compose up --build
```

**That's it!** Docker will:
1. Start PostgreSQL database
2. Run Django migrations
3. Create database tables
4. Start backend API server
5. Start frontend web server
6. Start Redis cache
7. Start Celery worker

### Step 3: Access Your Application

Open your browser:
- **Landing Page**: http://localhost:3000
- **API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/docs

## First Time Setup

### Create Admin User

```bash
# While Docker is running, open a new terminal:
docker-compose exec backend python manage.py createsuperuser

# Follow prompts:
Phone: 08012345678
Name: Admin User
Password: ******
```

### Access Django Admin

1. Go to http://localhost:8000/admin
2. Login with phone and password
3. You can now:
   - Add clusters
   - Add products
   - Add vendors
   - Add vendor prices
   - View orders
   - Manage users

## Project Structure Explained

```
agrobridge/
├── backend/                    # Django API
│   ├── apps/
│   │   ├── users/             # User authentication & management
│   │   │   ├── models.py      # User model with custom auth
│   │   │   ├── serializers.py # User data serialization
│   │   │   ├── views.py       # Login, register, profile APIs
│   │   │   └── urls.py        # /api/auth/* endpoints
│   │   │
│   │   ├── clusters/          # Cluster management
│   │   │   ├── models.py      # Cluster model
│   │   │   └── ...            # Cluster APIs
│   │   │
│   │   ├── products/          # Product catalog
│   │   │   ├── models.py      # Product & Category models
│   │   │   └── ...            # Product APIs
│   │   │
│   │   ├── vendors/           # Vendor & pricing
│   │   │   ├── models.py      # Vendor & VendorPrice models
│   │   │   └── ...            # Vendor APIs
│   │   │
│   │   ├── orders/            # Order processing
│   │   │   ├── models.py      # Order & OrderItem models
│   │   │   └── ...            # Order APIs
│   │   │
│   │   └── deliveries/        # Delivery coordination
│   │       ├── models.py      # Delivery model
│   │       └── ...            # Delivery APIs
│   │
│   ├── config/
│   │   ├── settings.py        # Django configuration
│   │   ├── urls.py            # Main URL routing
│   │   └── celery.py          # Background tasks config
│   │
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend container config
│   └── manage.py              # Django management commands
│
├── frontend/                   # Next.js Web App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Landing page (YOUR DESIGN!)
│   │   │   ├── layout.tsx     # App layout
│   │   │   └── globals.css    # Global styles
│   │   │
│   │   └── components/        # Reusable React components
│   │
│   ├── package.json           # Node dependencies
│   ├── next.config.js         # Next.js configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── Dockerfile.dev         # Frontend container config
│
└── docker-compose.yml         # Orchestrates all services
```

## Database Schema (Implemented)

All tables from your schema are created:

- **users** - Custom user model with phone authentication
- **clusters** - Geographic buying clusters
- **categories** - Product categories
- **products** - Food items catalog
- **vendors** - Supplier information
- **vendor_prices** - Dynamic pricing from vendors
- **orders** - Customer orders
- **order_items** - Items in orders
- **deliveries** - Delivery coordination

## API Endpoints (Ready to Use)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/token/refresh` - Refresh JWT token

### Clusters
- `GET /api/clusters` - List all active clusters
- `GET /api/clusters/{id}` - Get cluster details

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `GET /api/products/categories` - List categories

### Vendors
- `GET /api/vendors` - List all vendors
- `GET /api/vendors/prices` - Get vendor prices

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - List user's orders
- `GET /api/orders/{id}` - Get order details
- `PATCH /api/orders/{id}/status` - Update order status

### Deliveries
- `GET /api/deliveries` - List deliveries
- `GET /api/deliveries/{id}` - Get delivery details

Full API documentation available at: http://localhost:8000/api/docs

## Testing the System

### 1. Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "08012345678",
    "password": "testpass123",
    "password_confirm": "testpass123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "08012345678",
    "password": "testpass123"
  }'
```

You'll receive JWT tokens. Use the access token for authenticated requests:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:8000/api/orders
```

## Development Workflow

### Backend Changes

```bash
# Make model changes
cd backend/apps/users/
nano models.py

# Create migration
docker-compose exec backend python manage.py makemigrations

# Apply migration
docker-compose exec backend python manage.py migrate
```

### Frontend Changes

```bash
# Edit frontend files
cd frontend/src/app/
nano page.tsx

# Changes auto-reload in browser (Hot Reload enabled)
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Everything

```bash
docker-compose down
```

## Next Steps for Development

### Phase 1: Core Features (You are here!)
✅ Database setup
✅ Authentication
✅ Basic API endpoints
✅ Landing page

### Phase 2: Order Aggregation (Next)
- [ ] Implement price matching algorithm
- [ ] Add order aggregation logic
- [ ] Create vendor assignment system
- [ ] Build admin dashboard

### Phase 3: Payments & Delivery
- [ ] Integrate payment gateway (Paystack/Flutterwave)
- [ ] Add delivery scheduling
- [ ] Implement order tracking
- [ ] SMS/WhatsApp notifications

### Phase 4: Mobile App
- [ ] Build React Native mobile app
- [ ] Add push notifications
- [ ] Offline order queueing

## Common Issues & Solutions

### Port Already in Use

```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or change port in docker-compose.yml
ports:
  - "8001:8000"  # Changed from 8000:8000
```

### Database Connection Error

```bash
# Restart database service
docker-compose restart db

# Or reset everything
docker-compose down -v
docker-compose up --build
```

### Frontend Not Loading

```bash
# Clear Next.js cache
cd frontend
rm -rf .next
docker-compose up --build frontend
```

## Production Deployment

When ready for production:

1. Change DEBUG to False in settings.py
2. Set strong SECRET_KEY
3. Configure production database
4. Set up SSL certificates
5. Use gunicorn for Django (already in requirements.txt)
6. Build Next.js: `npm run build`
7. Deploy to AWS/Google Cloud/Azure

## Support & Documentation

- **Django Docs**: https://docs.djangoproject.com/
- **Next.js Docs**: https://nextjs.org/docs
- **DRF Docs**: https://www.django-rest-framework.org/
- **Docker Docs**: https://docs.docker.com/

## What's Configured

✅ JWT Authentication with refresh tokens
✅ CORS enabled for frontend-backend communication
✅ PostgreSQL with connection pooling
✅ Redis caching
✅ Celery for background tasks
✅ API documentation (Swagger/OpenAPI)
✅ Admin interface
✅ Hot reload for development
✅ Tailwind CSS with custom theme (AJ-Fresh colors)
✅ TypeScript for type safety
✅ Responsive mobile-first design

## You're Ready to Code!

Everything is set up. You can now:

1. Start developing features
2. Test APIs
3. Customize the frontend
4. Add business logic
5. Build the aggregation engine

**Your development environment is production-grade and ready for serious work!**
