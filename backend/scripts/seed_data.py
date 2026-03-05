"""Seed sample products and vendors"""
from apps.vendors.models import Vendor, VendorPrice
from apps.products.models import Product, Category

def seed():
    print("Seeding data...")
    
    # Create categories
    categories = {
        'Vegetables': Category.objects.get_or_create(name='Vegetables', description='Fresh vegetables')[0],
        'Grains': Category.objects.get_or_create(name='Grains', description='Rice, beans, etc.')[0],
        'Tubers': Category.objects.get_or_create(name='Tubers', description='Yam, potato, etc.')[0],
        'Fruits': Category.objects.get_or_create(name='Fruits', description='Fresh fruits')[0],
        'Protein': Category.objects.get_or_create(name='Protein', description='Fish, meat, eggs')[0],
        'Oil': Category.objects.get_or_create(name='Oil & Spices', description='Cooking oils and spices')[0],
    }
    
    # Create vendors
    vendors = [
        Vendor.objects.get_or_create(
            name='Mama Ngozi Farm',
            defaults={
                'vendor_type': 'FARMER',
                'phone': '08012345671',
                'address': 'Ikeja, Lagos',
                'trust_score': 4.8,
                'is_verified': True,
            }
        )[0],
        Vendor.objects.get_or_create(
            name='Balogun Wholesales',
            defaults={
                'vendor_type': 'WHOLESALER',
                'phone': '08012345672',
                'address': 'Mile 12 Market, Lagos',
                'trust_score': 4.5,
                'is_verified': True,
            }
        )[0],
        Vendor.objects.get_or_create(
            name='Fresh Harvest Co-op',
            defaults={
                'vendor_type': 'COOPERATIVE',
                'phone': '08012345673',
                'address': 'Mushin, Lagos',
                'trust_score': 4.9,
                'is_verified': True,
            }
        )[0],
    ]
    
    # Create products
    products_data = [
        {'name': 'Fresh Tomatoes', 'category': categories['Vegetables'], 'unit': 'KG', 'description': 'Fresh red tomatoes'},
        {'name': 'Rice (Ofada)', 'category': categories['Grains'], 'unit': 'KG', 'description': 'Local Ofada rice'},
        {'name': 'White Rice', 'category': categories['Grains'], 'unit': 'BAG', 'description': 'Premium white rice'},
        {'name': 'Yam', 'category': categories['Tubers'], 'unit': 'PIECE', 'description': 'Fresh tuber yam'},
        {'name': 'Plantain', 'category': categories['Fruits'], 'unit': 'PIECE', 'description': 'Ripe plantain'},
        {'name': 'Fresh Fish (Tilapia)', 'category': categories['Protein'], 'unit': 'KG', 'description': 'Fresh tilapia fish'},
        {'name': 'Palm Oil', 'category': categories['Oil'], 'unit': 'L', 'description': 'Pure palm oil'},
        {'name': 'Onions', 'category': categories['Vegetables'], 'unit': 'KG', 'description': 'Fresh onions'},
        {'name': 'Pepper (Scotch Bonnet)', 'category': categories['Vegetables'], 'unit': 'KG', 'description': 'Fresh scotch bonnet pepper'},
        {'name': 'Beans (Brown)', 'category': categories['Grains'], 'unit': 'KG', 'description': 'Brown beans'},
    ]
    
    for product_data in products_data:
        product, created = Product.objects.get_or_create(
            name=product_data['name'],
            defaults=product_data
        )
        
        # Add random prices from vendors
        import random
        base_prices = {
            'Fresh Tomatoes': 500,
            'Rice (Ofada)': 800,
            'White Rice': 35000,
            'Yam': 300,
            'Plantain': 150,
            'Fresh Fish (Tilapia)': 1500,
            'Palm Oil': 1200,
            'Onions': 400,
            'Pepper (Scotch Bonnet)': 600,
            'Beans (Brown)': 700,
        }
        
        base_price = base_prices.get(product.name, 1000)
        
        for vendor in random.sample(vendors, k=random.randint(1, 3)):
            # Random price variation (±20%)
            price = base_price * random.uniform(0.8, 1.2)
            
            VendorPrice.objects.get_or_create(
                vendor=vendor,
                product=product,
                defaults={
                    'price': round(price, 2),
                    'is_available': True,
                    'stock_quantity': random.randint(50, 500),
                    'min_quantity': 1,
                }
            )
    
    print("✅ Data seeded successfully!")
    print(f"Categories: {Category.objects.count()}")
    print(f"Vendors: {Vendor.objects.count()}")
    print(f"Products: {Product.objects.count()}")
    print(f"Vendor Prices: {VendorPrice.objects.count()}")

if __name__ == '__main__':
    seed()