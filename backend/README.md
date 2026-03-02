# AgroBridge Backend API

Django REST Framework backend for the AgroBridge food aggregation platform.

## 📋 Quick Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not using Docker)
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Run with Docker (Recommended)
docker-compose up -d

# Or run locally
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## 🗄️ Database Schema

### Core Tables Created:
- **users** - Custom user model with phone-based auth
- **clusters** - Geographic buying clusters
- **products** - Product catalog with categories
- **vendors** - Verified food suppliers
- **vendor_prices** - Real-time vendor pricing
- **orders** - Customer orders
- **order_items** - Order line items
- **aggregation_runs** - Aggregation engine runs
- **price_optimizations** - Price matching results
- **deliveries** - Delivery tracking
- **delivery_routes** - Optimized routes

## 🔑 Authentication

JWT-based authentication using phone numbers:

```bash
# Register
POST /api/v1/auth/register
{
  "phone": "+2348012345678",
  "full_name": "John Doe",
  "password": "securepass123"
}

# Login
POST /api/v1/auth/login
{
  "phone": "+2348012345678",
  "password": "securepass123"
}

# Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Clusters
- `GET /api/v1/clusters/` - List all clusters
- `GET /api/v1/clusters/{id}/` - Get cluster details
- `POST /api/v1/clusters/` - Create cluster (admin)

### Products
- `GET /api/v1/products/` - List products
- `GET /api/v1/products/{id}/` - Get product details
- `GET /api/v1/products/categories/` - List categories

### Vendors
- `GET /api/v1/vendors/` - List verified vendors
- `GET /api/v1/vendors/{id}/prices/` - Get vendor prices
- `POST /api/v1/vendors/prices/` - Submit prices (vendor only)

### Orders
- `POST /api/v1/orders/` - Create order
- `GET /api/v1/orders/` - List user orders
- `GET /api/v1/orders/{id}/` - Get order details
- `PATCH /api/v1/orders/{id}/` - Update order
- `DELETE /api/v1/orders/{id}/` - Cancel order

### Aggregation
- `POST /api/v1/aggregation/run/` - Trigger aggregation (admin)
- `GET /api/v1/aggregation/runs/` - List aggregation runs
- `GET /api/v1/aggregation/runs/{id}/` - Get run details

### Deliveries
- `GET /api/v1/deliveries/` - List deliveries
- `GET /api/v1/deliveries/{id}/` - Get delivery details
- `PATCH /api/v1/deliveries/{id}/status/` - Update status (courier)

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=apps --cov-report=html

# Run specific app tests
pytest apps/users/tests/
```

## 🔧 Development Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run development server
python manage.py runserver

# Start Celery worker
celery -A agrobridge worker -l info

# Start Celery beat
celery -A agrobridge beat -l info
```

## 📊 Admin Panel

Access Django admin at: `http://localhost:8000/admin`

Features:
- User management
- Cluster configuration
- Product catalog management
- Vendor verification
- Order monitoring
- Aggregation run tracking

## 🎯 Core Business Logic

### Aggregation Algorithm

Located in `apps/aggregation/services.py`:

```python
def run_aggregation(cluster_id):
    """
    1. Collect all pending orders in cluster
    2. Group by product
    3. Find cheapest vendor for each product
    4. Assign vendors to order items
    5. Calculate savings
    6. Create delivery schedule
    """
```

### Price Matching

```python
def match_best_prices(products_needed):
    """
    For each product:
    - Query all vendor prices
    - Filter by availability
    - Sort by price (ascending)
    - Select vendor with best price
    - Record optimization
    """
```

## 🔐 Environment Variables

Create `.env` file:

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agrobridge

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# JWT
JWT_ACCESS_TOKEN_LIFETIME=1  # hours
JWT_REFRESH_TOKEN_LIFETIME=7  # days

# File uploads
MEDIA_ROOT=/app/media
STATIC_ROOT=/app/staticfiles
```

## 📦 App Structure

```
backend/
├── apps/
│   ├── users/          # User authentication & profiles
│   ├── clusters/       # Geographic clusters
│   ├── products/       # Product catalog
│   ├── vendors/        # Vendor management
│   ├── orders/         # Order processing
│   ├── aggregation/    # Core aggregation engine
│   └── deliveries/     # Delivery tracking
├── config/             # Django settings
│   ├── settings.py
│   ├── urls.py
│   ├── celery.py
│   └── wsgi.py
├── manage.py
├── requirements.txt
└── Dockerfile
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure PostgreSQL
- [ ] Set up Redis
- [ ] Configure static files (S3/CloudFront)
- [ ] Set up SSL certificates
- [ ] Configure CORS properly
- [ ] Set up monitoring (Sentry)
- [ ] Configure backups
- [ ] Set up CI/CD pipeline

### Docker Production Build

```bash
docker build -t agrobridge-backend:prod -f Dockerfile.prod .
docker run -p 8000:8000 agrobridge-backend:prod
```

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- Redis caching for product prices
- Celery for async tasks (email, notifications)
- Database connection pooling
- Query optimization with select_related/prefetch_related

## 🐛 Debugging

```python
# Enable Django Debug Toolbar
INSTALLED_APPS += ['debug_toolbar']

# Access at /__debug__/
```

## 📝 API Documentation

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## 🤝 Contributing

1. Create feature branch
2. Write tests
3. Ensure tests pass
4. Submit PR

## 📞 Support

For issues or questions, contact the development team.
