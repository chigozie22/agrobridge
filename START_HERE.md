# 🚀 AgroBridge - Start Here!

## Quick Start (Literally 2 Commands)

```bash
# 1. Start everything
docker-compose up --build

# 2. Open your browser
# Landing Page: http://localhost:3000
# API: http://localhost:8000/api
# Admin: http://localhost:8000/admin
# API Docs: http://localhost:8000/api/docs
```

## What Just Happened?

Docker automatically:
✅ Created PostgreSQL database
✅ Ran all database migrations
✅ Created all tables (users, clusters, products, vendors, orders, etc.)
✅ Started Django API server
✅ Started Next.js web server
✅ Started Redis cache
✅ Started Celery worker

## Create Admin Account

In a new terminal (while Docker is running):

```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts:
- Phone: 08012345678
- Name: Admin
- Password: admin123

Then login at http://localhost:8000/admin

## What's Working?

1. **Landing Page** (http://localhost:3000)
   - Your exact design (dark theme, yellow/green accents)
   - Cluster selection
   - WhatsApp integration
   - Fully responsive

2. **API** (http://localhost:8000/api)
   - User registration/login
   - Cluster management
   - Product catalog
   - Order processing
   - All authenticated with JWT

3. **Database** (PostgreSQL)
   - All tables created
   - Ready for data

4. **Admin Panel** (http://localhost:8000/admin)
   - Add clusters
   - Add products
   - Add vendors
   - Manage orders

## Test the API

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "08087654321",
    "password": "testpass123",
    "password_confirm": "testpass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "08087654321",
    "password": "testpass123"
  }'
```

## Project Structure

```
├── backend/          # Django API (Python)
│   ├── apps/
│   │   ├── users/    # Authentication
│   │   ├── clusters/ # Cluster management
│   │   ├── products/ # Product catalog
│   │   ├── vendors/  # Vendor management
│   │   ├── orders/   # Order processing
│   │   └── deliveries/ # Delivery coordination
│   └── config/       # Settings
│
├── frontend/         # Next.js Website (TypeScript)
│   └── src/
│       └── app/
│           └── page.tsx  # Landing page
│
└── docker-compose.yml    # Orchestrates everything
```

## Common Commands

```bash
# Stop everything
docker-compose down

# Restart
docker-compose up

# View logs
docker-compose logs -f

# Access Django shell
docker-compose exec backend python manage.py shell

# Run migrations
docker-compose exec backend python manage.py migrate

# Create migration after model changes
docker-compose exec backend python manage.py makemigrations
```

## Next Steps

1. **Add Data via Admin Panel**
   - Go to http://localhost:8000/admin
   - Add clusters (ESUT, UNN, etc.)
   - Add product categories
   - Add products
   - Add vendors
   - Add vendor prices

2. **Test the Flow**
   - Visit http://localhost:3000
   - Select a cluster
   - Register as user via API
   - Create an order via API

3. **Start Building Features**
   - Price aggregation algorithm
   - Order batching logic
   - Payment integration
   - SMS notifications

## Full Documentation

See `SETUP_GUIDE.md` for complete documentation.

## Need Help?

Everything is configured and working. If something doesn't work:
1. Make sure Docker Desktop is running
2. Check `docker-compose logs -f` for errors
3. Try `docker-compose down -v` then `docker-compose up --build`

**You're ready to build! 🎉**
