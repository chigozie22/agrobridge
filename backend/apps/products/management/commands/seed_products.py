from django.core.management.base import BaseCommand
from apps.products.models import Product, Category
from apps.vendors.models import Vendor, VendorPrice
from apps.clusters.models import Cluster
import random


class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        # ==========================================
        # 1. CREATE CLUSTERS (Owerri/FUTO Areas)
        # ==========================================
        
        clusters_data = [
            # ========================================
            # FUTO CAMPUS CLUSTERS (3)
            # ========================================
            {
                'name': 'FUTO Main Hostels',
                'location': 'Hostels A-D, FUTO Campus, Owerri',
                'description': 'Serving main campus hostels (A, B, C, D blocks)',
                'status': 'ACTIVE',
                'min_order_value': 3000,
                'delivery_fee': 200,
                'admin_name': 'Campus Coordinator',
                'admin_phone': '08011111111',
            },
            {
                'name': 'FUTO New Hostels',
                'location': 'NDDC, TETFUND Hostels, FUTO, Owerri',
                'description': 'Serving new generation hostels (NDDC, TETFUND)',
                'status': 'ACTIVE',
                'min_order_value': 3000,
                'delivery_fee': 200,
                'admin_name': 'Campus Coordinator',
                'admin_phone': '08011111112',
            },
            {
                'name': 'Ihiagwa/Back Gate',
                'location': 'Ihiagwa Community, Back Gate Area, Owerri',
                'description': 'Serving off-campus students near FUTO back gate',
                'status': 'ACTIVE',
                'min_order_value': 4000,
                'delivery_fee': 300,
                'admin_name': 'Ihiagwa Coordinator',
                'admin_phone': '08011111113',
            },
            
            # ========================================
            # FUTO ENVIRONS (2)
            # ========================================
            {
                'name': 'Eziobodo Cluster',
                'location': 'Eziobodo Town, Owerri',
                'description': 'Serving Eziobodo community and off-campus students',
                'status': 'ACTIVE',
                'min_order_value': 4000,
                'delivery_fee': 300,
                'admin_name': 'Eziobodo Coordinator',
                'admin_phone': '08022222221',
            },
            {
                'name': 'Umuchima Cluster',
                'location': 'Umuchima Community, Owerri',
                'description': 'Serving Umuchima area near FUTO',
                'status': 'ACTIVE',
                'min_order_value': 4000,
                'delivery_fee': 350,
                'admin_name': 'Umuchima Coordinator',
                'admin_phone': '08022222222',
            },
            
            # ========================================
            # OWERRI TOWN CLUSTERS (5)
            # ========================================
            {
                'name': 'World Bank/New Owerri',
                'location': 'World Bank, New Owerri, Owerri',
                'description': 'Serving New Owerri and World Bank areas',
                'status': 'ACTIVE',
                'min_order_value': 5000,
                'delivery_fee': 400,
                'admin_name': 'New Owerri Coordinator',
                'admin_phone': '08033333331',
            },
            {
                'name': 'Wetheral/Douglas Road',
                'location': 'Wetheral Road, Douglas Road, Owerri',
                'description': 'Serving town center and commercial areas',
                'status': 'ACTIVE',
                'min_order_value': 5000,
                'delivery_fee': 350,
                'admin_name': 'Wetheral Coordinator',
                'admin_phone': '08033333332',
            },
            {
                'name': 'Ikenegbu Layout',
                'location': 'Ikenegbu Layout, Owerri',
                'description': 'Serving Ikenegbu residential area',
                'status': 'ACTIVE',
                'min_order_value': 5000,
                'delivery_fee': 400,
                'admin_name': 'Ikenegbu Coordinator',
                'admin_phone': '08033333333',
            },
            {
                'name': 'Orji Cluster',
                'location': 'Orji Town, Owerri',
                'description': 'Serving Orji residential and commercial area',
                'status': 'ACTIVE',
                'min_order_value': 5000,
                'delivery_fee': 400,
                'admin_name': 'Orji Coordinator',
                'admin_phone': '08033333334',
            },
            {
                'name': 'Irette Cluster',
                'location': 'Irette Community, Owerri',
                'description': 'Serving Irette and surrounding areas',
                'status': 'ACTIVE',
                'min_order_value': 4500,
                'delivery_fee': 350,
                'admin_name': 'Irette Coordinator',
                'admin_phone': '08033333335',
            },
        ]
        
        for cluster_data in clusters_data:
            cluster, created = Cluster.objects.get_or_create(
                name=cluster_data['name'],
                defaults=cluster_data
            )
            if created:
                self.stdout.write(f'✓ Created cluster: {cluster.name}')
        
        self.stdout.write(f'\n✅ Total clusters: {Cluster.objects.count()}')
        
        # ==========================================
        # 2. CREATE CATEGORIES
        # ==========================================
        
        cats = {
            'Vegetables': Category.objects.get_or_create(
                name='Vegetables',
                defaults={'description': 'Fresh vegetables', 'icon': '🥬'}
            )[0],
            'Grains': Category.objects.get_or_create(
                name='Grains',
                defaults={'description': 'Rice, beans, etc.', 'icon': '🌾'}
            )[0],
            'Cereals': Category.objects.get_or_create(
                name='Cereals',
                defaults={'description': 'Breakfast cereals', 'icon': '🥣'}
            )[0],
            'Tubers': Category.objects.get_or_create(
                name='Tubers',
                defaults={'description': 'Yam, plantain, etc.', 'icon': '🍠'}
            )[0],
            'Fruits': Category.objects.get_or_create(
                name='Fruits',
                defaults={'description': 'Fresh fruits', 'icon': '🍎'}
            )[0],
            'Protein': Category.objects.get_or_create(
                name='Protein',
                defaults={'description': 'Fish, meat, eggs', 'icon': '🐟'}
            )[0],
            'Oils': Category.objects.get_or_create(
                name='Oils & Spices',
                defaults={'description': 'Cooking oils and spices', 'icon': '🛢️'}
            )[0],
        }
        
        self.stdout.write(f'✅ Categories created: {len(cats)}')
        
        # ==========================================
        # 3. CREATE VENDORS
        # ==========================================
        
        vendors_data = [
            {
                'name': 'Mama Ngozi Farm',
                'vendor_type': 'FARMER',
                'phone': '08012345678',
                'email': 'ngozi@farm.com',
                'address': 'Eziobodo, Owerri',
                'is_verified': True,
                'trust_score': 4.8,
            },
            {
                'name': 'Balogun Wholesales',
                'vendor_type': 'WHOLESALER',
                'phone': '08023456789',
                'email': 'balogun@wholesale.com',
                'address': 'Relief Market, Owerri',
                'is_verified': True,
                'trust_score': 4.6,
            },
            {
                'name': 'Fresh Harvest Co-op',
                'vendor_type': 'COOPERATIVE',
                'phone': '08034567890',
                'email': 'info@freshharvest.com',
                'address': 'Orji, Owerri',
                'is_verified': True,
                'trust_score': 4.9,
            },
        ]
        
        vendors = []
        for vendor_data in vendors_data:
            vendor, created = Vendor.objects.get_or_create(
                name=vendor_data['name'],
                defaults=vendor_data
            )
            vendors.append(vendor)
            if created:
                self.stdout.write(f'✓ Created vendor: {vendor.name}')
        
        self.stdout.write(f'✅ Total vendors: {Vendor.objects.count()}')
        
        # ==========================================
        # 4. CREATE PRODUCTS
        # ==========================================
        
        products_data = [
            {
                'name': 'Fresh Tomatoes',
                'description': 'Fresh red tomatoes from local farms',
                'category': cats['Vegetables'],
                'unit': 'kg',
                'requires_refrigeration': True,
                'shelf_life_days': 7,
            },
            {
                'name': 'Long Grain Rice',
                'description': 'Premium parboiled rice',
                'category': cats['Grains'],
                'unit': 'kg',
                'requires_refrigeration': False,
                'shelf_life_days': 365,
            },
            {
                'name': 'White Yam',
                'description': 'Fresh yam tubers',
                'category': cats['Tubers'],
                'unit': 'tuber',
                'requires_refrigeration': False,
                'shelf_life_days': 30,
            },
            {
                'name': 'Ripe Plantain',
                'description': 'Sweet ripe plantains',
                'category': cats['Fruits'],
                'unit': 'bunch',
                'requires_refrigeration': False,
                'shelf_life_days': 5,
            },
            {
                'name': 'Frozen Fish',
                'description': 'Fresh frozen mackerel',
                'category': cats['Protein'],
                'unit': 'kg',
                'requires_refrigeration': True,
                'shelf_life_days': 90,
            },
            {
                'name': 'Palm Oil',
                'description': 'Pure red palm oil',
                'category': cats['Oils'],
                'unit': 'litre',
                'requires_refrigeration': False,
                'shelf_life_days': 180,
            },
            {
                'name': 'Red Onions',
                'description': 'Fresh red onions',
                'category': cats['Vegetables'],
                'unit': 'kg',
                'requires_refrigeration': False,
                'shelf_life_days': 14,
            },
            {
                'name': 'Red Pepper',
                'description': 'Fresh hot pepper',
                'category': cats['Vegetables'],
                'unit': 'kg',
                'requires_refrigeration': True,
                'shelf_life_days': 7,
            },
            {
                'name': 'Cornflakes',
                'description': 'Breakfast cereal cornflakes',
                'category': cats['Cereals'],
                'unit': 'pack',
                'requires_refrigeration': False,
                'shelf_life_days': 180,
            },
            {
                'name': 'Golden Morn',
                'description': 'Nutritious breakfast cereal',
                'category': cats['Cereals'],
                'unit': 'pack',
                'requires_refrigeration': False,
                'shelf_life_days': 180,
            },
        ]
        
        products = []
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            products.append(product)
            if created:
                self.stdout.write(f'✓ Created product: {product.name}')
        
        self.stdout.write(f'✅ Total products: {Product.objects.count()}')
        
        # ==========================================
        # 5. CREATE VENDOR PRICES (Random)
        # ==========================================
        
        price_count = 0
        for product in products:
            # Randomly assign 1-3 vendors per product
            num_vendors = random.randint(1, 3)
            selected_vendors = random.sample(vendors, num_vendors)
            
            for vendor in selected_vendors:
                # Generate random price based on product type
                if product.category.name == 'Vegetables':
                    base_price = random.randint(300, 800)
                elif product.category.name == 'Grains':
                    base_price = random.randint(400, 1200)
                elif product.category.name == 'Cereals':
                    base_price = random.randint(800, 2500)
                elif product.category.name == 'Tubers':
                    base_price = random.randint(500, 1500)
                elif product.category.name == 'Protein':
                    base_price = random.randint(1000, 3000)
                elif product.category.name == 'Oils':
                    base_price = random.randint(1500, 4000)
                else:
                    base_price = random.randint(500, 2000)
                
                vendor_price, created = VendorPrice.objects.get_or_create(
                    vendor=vendor,
                    product=product,
                    defaults={
                        'price': base_price,
                        'min_quantity': random.choice([1, 2, 5]),
                        'is_available': True,
                        'stock_quantity': random.randint(50, 500),
                    }
                )
                if created:
                    price_count += 1
        
        self.stdout.write(f'✅ Total vendor prices created: {price_count}')
        
        # ==========================================
        # FINAL SUMMARY
        # ==========================================
        
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('✅ SEEDING COMPLETE!'))
        self.stdout.write('='*50)
        self.stdout.write(f'Clusters: {Cluster.objects.count()}')
        self.stdout.write(f'Categories: {Category.objects.count()}')
        self.stdout.write(f'Vendors: {Vendor.objects.count()}')
        self.stdout.write(f'Products: {Product.objects.count()}')
        self.stdout.write(f'Vendor Prices: {VendorPrice.objects.count()}')
        self.stdout.write('='*50 + '\n')