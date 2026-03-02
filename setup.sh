#!/bin/bash

# AgroBridge Setup Script
# This script will set up your complete development environment

set -e

echo "🚀 Setting up AgroBridge Development Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "${YELLOW}⚠️  Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "${YELLOW}⚠️  Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo "${GREEN}✓ Docker and Docker Compose are installed${NC}"

# Create environment files
echo ""
echo "📝 Creating environment files..."

# Backend .env
cat > backend/.env << EOF
DEBUG=True
SECRET_KEY=dev-secret-key-$(openssl rand -base64 32)
ALLOWED_HOSTS=localhost,127.0.0.1,backend
DATABASE_URL=postgresql://agrobridge_user:agrobridge_dev_password@db:5432/agrobridge
REDIS_URL=redis://redis:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF

echo "${GREEN}✓ Created backend/.env${NC}"

# Frontend .env
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
EOF

echo "${GREEN}✓ Created frontend/.env.local${NC}"

# Build and start services
echo ""
echo "🐳 Building Docker containers..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

# Wait for database to be ready
echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Create superuser script
echo ""
echo "👤 Creating superuser..."
docker-compose exec -T backend python manage.py shell << EOF
from apps.users.models import User
from django.db import IntegrityError

try:
    if not User.objects.filter(phone='+2348000000000').exists():
        User.objects.create_superuser(
            phone='+2348000000000',
            full_name='Admin User',
            password='admin123',
            is_staff=True,
            is_superuser=True
        )
        print('Superuser created successfully!')
    else:
        print('Superuser already exists')
except Exception as e:
    print(f'Error creating superuser: {e}')
EOF

# Create sample data
echo ""
echo "📊 Creating sample data..."
docker-compose exec -T backend python manage.py shell << EOF
from apps.clusters.models import Cluster

# Create sample clusters
clusters = [
    {
        'name': 'Enugu State University (ESUT) - Agbani',
        'location': 'ESUT Campus',
        'city': 'Enugu',
        'state': 'Enugu',
        'status': 'pilot'
    },
    {
        'name': 'University of Nigeria (UNN) - Nsukka',
        'location': 'UNN Campus',
        'city': 'Nsukka',
        'state': 'Enugu',
        'status': 'pilot'
    },
    {
        'name': 'Federal Housing Estate - Trans Ekulu',
        'location': 'Trans Ekulu',
        'city': 'Enugu',
        'state': 'Enugu',
        'status': 'active'
    },
    {
        'name': 'Independence Layout - Phase 1',
        'location': 'Independence Layout',
        'city': 'Enugu',
        'state': 'Enugu',
        'status': 'active'
    },
    {
        'name': 'Akwata Market Cluster',
        'location': 'Akwata Market',
        'city': 'Owerri',
        'state': 'Imo',
        'status': 'pilot'
    }
]

for cluster_data in clusters:
    Cluster.objects.get_or_create(
        name=cluster_data['name'],
        defaults=cluster_data
    )

print('Sample clusters created!')
EOF

# Display access information
echo ""
echo "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo "${GREEN}✅ AgroBridge Setup Complete!${NC}"
echo "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "🌐 Access your applications:"
echo "   • Frontend:          http://localhost:3000"
echo "   • Backend API:       http://localhost:8000/api/v1"
echo "   • API Documentation: http://localhost:8000/api/docs"
echo "   • Admin Panel:       http://localhost:8000/admin"
echo ""
echo "🔐 Admin credentials:"
echo "   • Phone:    +2348000000000"
echo "   • Password: admin123"
echo ""
echo "📦 Services running:"
echo "   • PostgreSQL:  localhost:5432"
echo "   • Redis:       localhost:6379"
echo "   • Backend:     localhost:8000"
echo "   • Frontend:    localhost:3000"
echo ""
echo "🛠️  Useful commands:"
echo "   • View logs:        docker-compose logs -f"
echo "   • Stop services:    docker-compose stop"
echo "   • Restart:          docker-compose restart"
echo "   • Shut down:        docker-compose down"
echo ""
echo "${GREEN}Happy coding! 🚀${NC}"
