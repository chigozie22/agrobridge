#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed_clusters
python manage.py seed_products
python manage.py seed_combos
python manage.py shell -c "
from apps.users.models import User
u = User.objects.filter(email='trentjoshuaeee@gmail.com').first()
if u:
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print('Admin promoted:', u.email)
else:
    print('User not found')
"
