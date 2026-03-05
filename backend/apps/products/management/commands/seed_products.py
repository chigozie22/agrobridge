from django.core.management.base import BaseCommand
from apps.vendors.models import Vendor, VendorPrice
from apps.products.models import Product, Category
import random

class Command(BaseCommand):
    help = 'Seed products and vendors'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        # Create categories
        cats = {
            'Vegetables': Category.objects.get_or_create(name='Vegetables')[0],
            'Grains': Category.objects.get_or_create(name='Grains')[0],
            'Tubers': Category.objects.get_or_create(name='Tubers')[0],
            'Fruits': Category.objects.get_or_create(name='Fruits')[0],
            'Protein': Category.objects.get_or_create(name='Protein')[0],
            'Oil': Category.objects.get_or_create(name='Oil & Spices')[0],
        }
        
        # Create vendors
        v1, _ = Vendor.objects.get_or_create(name='Mama Ngozi Farm', defaults={'vendor_type': 'FARMER', 'phone': '08012345671', 'address': 'Ikeja, Lagos', 'trust_score': 4.8, 'is_verified': True})
        v2, _ = Vendor.objects.get_or_create(name='Balogun Wholesales', defaults={'vendor_type': 'WHOLESALER', 'phone': '08012345672', 'address': 'Mile 12, Lagos', 'trust_score': 4.5, 'is_verified': True})
        v3, _ = Vendor.objects.get_or_create(name='Fresh Harvest Co-op', defaults={'vendor_type': 'COOPERATIVE', 'phone': '08012345673', 'address': 'Mushin, Lagos', 'trust_score': 4.9, 'is_verified': True})
        
        vendors = [v1, v2, v3]
        
        # Create products
        products_data = [
            {'name': 'Fresh Tomatoes', 'category': cats['Vegetables'], 'unit': 'KG', 'price': 500},
            {'name': 'Rice (Ofada)', 'category': cats['Grains'], 'unit': 'KG', 'price': 800},
            {'name': 'White Rice', 'category': cats['Grains'], 'unit': 'BAG', 'price': 35000},
            {'name': 'Yam', 'category': cats['Tubers'], 'unit': 'PIECE', 'price': 300},
            {'name': 'Plantain', 'category': cats['Fruits'], 'unit': 'PIECE', 'price': 150},
            {'name': 'Fresh Fish', 'category': cats['Protein'], 'unit': 'KG', 'price': 1500},
            {'name': 'Palm Oil', 'category': cats['Oil'], 'unit': 'L', 'price': 1200},
            {'name': 'Onions', 'category': cats['Vegetables'], 'unit': 'KG', 'price': 400},
        ]
        
        for p_data in products_data:
            base_price = p_data.pop('price')
            product, created = Product.objects.get_or_create(name=p_data['name'], defaults=p_data)
            
            for vendor in random.sample(vendors, k=random.randint(1, 3)):
                price = base_price * random.uniform(0.8, 1.2)
                VendorPrice.objects.get_or_create(
                    vendor=vendor,
                    product=product,
                    defaults={'price': round(price, 2), 'is_available': True, 'stock_quantity': random.randint(50, 500)}
                )
        
        self.stdout.write(self.style.SUCCESS(f'✅ Done! Products: {Product.objects.count()}, Prices: {VendorPrice.objects.count()}'))