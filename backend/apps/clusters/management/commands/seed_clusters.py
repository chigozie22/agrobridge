from django.core.management.base import BaseCommand
from apps.clusters.models import Cluster


CLUSTERS = [
    {
        'name': 'FUTO / Ihiagwa Cluster',
        'location': 'Ihiagwa, Owerri West',
        'description': 'Covers FUTO main campus hostels, off-campus lodges around Ihiagwa.',
        'delivery_fee': 300,
        'status': 'ACTIVE',
        'admin_name': 'AgroBridge Owerri',
        'admin_phone': '08100000001',
    },
    {
        'name': 'Ikenegbu Cluster',
        'location': 'Ikenegbu Layout, Owerri',
        'description': 'Covers Ikenegbu Layout and surrounding streets.',
        'delivery_fee': 300,
        'status': 'ACTIVE',
        'admin_name': 'AgroBridge Owerri',
        'admin_phone': '08100000002',
    },
    {
        'name': 'New Owerri Cluster',
        'location': 'New Owerri, Owerri Municipal',
        'description': 'Covers New Owerri GRA and environs.',
        'delivery_fee': 350,
        'status': 'ACTIVE',
        'admin_name': 'AgroBridge Owerri',
        'admin_phone': '08100000003',
    },
    {
        'name': 'Egbu Road Cluster',
        'location': 'Egbu Road, Owerri North',
        'description': 'Covers Egbu Road axis and Owerri North communities.',
        'delivery_fee': 400,
        'status': 'ACTIVE',
        'admin_name': 'AgroBridge Owerri',
        'admin_phone': '08100000004',
    },
    {
        'name': 'Aladinma Cluster',
        'location': 'Aladinma Estate, Owerri',
        'description': 'Covers Aladinma Housing Estate and adjacent areas.',
        'delivery_fee': 350,
        'status': 'ACTIVE',
        'admin_name': 'AgroBridge Owerri',
        'admin_phone': '08100000005',
    },
    {
        'name': 'Uratta / Akachi Cluster',
        'location': 'Uratta Road / Akachi, Owerri',
        'description': 'Covers Uratta Road, Akachi Estate and surroundings.',
        'delivery_fee': 400,
        'status': 'ACTIVE',
        'admin_name': 'AgroBridge Owerri',
        'admin_phone': '08100000006',
    },
    {
        'name': 'Eziobodo Cluster',
        'location': 'Eziobodo Town, Owerri',
        'description': 'Covers Eziobodo community and nearby lodges.',
        'delivery_fee': 300,
        'status': 'ACTIVE',
        'admin_name': 'AgroBridge Owerri',
        'admin_phone': '08100000007',
    },
]


class Command(BaseCommand):
    help = 'Seed the database with the 7 AgroBridge Owerri clusters'

    def handle(self, *args, **options):
        if Cluster.objects.exists():
            self.stdout.write('Clusters already seeded — skipping.')
            return

        for data in CLUSTERS:
            Cluster.objects.create(**data)
            self.stdout.write(f"  Created: {data['name']}")

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(CLUSTERS)} clusters.'))
