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
email = 'trentjoshuaeee@gmail.com'
u = User.objects.filter(email=email).first()
if not u:
    u = User.objects.create_superuser(email=email, password='Admin@Agrobridge1', name='Chigozie')
    print('Superuser created:', email)
else:
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print('Superuser promoted:', email)
"
