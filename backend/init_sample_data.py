"""
Script to initialize the database with sample data for testing
Run this after migrations: python manage.py shell < init_sample_data.py
"""

from apps.clusters.models import Cluster
from apps.products.models import Category, Product
from apps.vendors.models import Vendor, VendorPrice
from apps.users.models import User
from decimal import Decimal

print("🚀 Initializing AgroBridge with sample data...")

# Create Clusters
clusters_data = [
    {"name": "Enugu State University (ESUT) - Agbani", "location": "Enugu State, Agbani", "status": "ACTIVE"},
    {"name": "University of Nigeria (UNN) - Nsukka", "location": "Enugu State, Nsukka", "status": "ACTIVE"},
    {"name": "Federal Housing Estate - Trans Ekulu", "location": "Enugu, Trans Ekulu", "status": "ACTIVE"},
    {"name": "Independence Layout - Phase 1", "location": "Enugu, Independence Layout", "status": "ACTIVE"},
    {"name": "Akwata Market Cluster", "location": "Enugu, Akwata", "status": "PILOT"},
]

for cluster_data in clusters_data:
    cluster, created = Cluster.objects.get_or_create(**cluster_data)
    if created:
        print(f"✅ Created cluster: {cluster.name}")

# Create Categories
categories_data = [
    {"name": "Vegetables", "description": "Fresh vegetables"},
    {"name": "Fruits", "description": "Fresh fruits"},
    {"name": "Grains & Cereals", "description": "Rice, beans, etc"},
    {"name": "Protein", "description": "Meat, fish, eggs"},
    {"name": "Tubers", "description": "Yam, cassava, potatoes"},
]

for cat_data in categories_data:
    category, created = Category.objects.get_or_create(**cat_data)
    if created:
        print(f"✅ Created category: {category.name}")

# Create Products
vegetables = Category.objects.get(name="Vegetables")
fruits = Category.objects.get(name="Fruits")
grains = Category.objects.get(name="Grains & Cereals")
protein = Category.objects.get(name="Protein")
tubers = Category.objects.get(name="Tubers")

products_data = [
    {"name": "Tomatoes", "category": vegetables, "unit": "KG"},
    {"name": "Onions", "category": vegetables, "unit": "KG"},
    {"name": "Pepper", "category": vegetables, "unit": "KG"},
    {"name": "Plantain", "category": fruits, "unit": "PIECE"},
    {"name": "Banana", "category": fruits, "unit": "PIECE"},
    {"name": "Rice (Local)", "category": grains, "unit": "BAG"},
    {"name": "Beans", "category": grains, "unit": "KG"},
    {"name": "Chicken", "category": protein, "unit": "KG"},
    {"name": "Fresh Fish", "category": protein, "unit": "KG"},
    {"name": "Yam", "category": tubers, "unit": "PIECE"},
]

for prod_data in products_data:
    product, created = Product.objects.get_or_create(**prod_data)
    if created:
        print(f"✅ Created product: {product.name}")

# Create Vendors
vendors_data = [
    {"name": "Mama Chidi's Farm", "vendor_type": "FARMER", "phone": "08011111111", "address": "Nsukka, Enugu", "trust_score": Decimal("4.8"), "is_verified": True},
    {"name": "Owerri Wholesale Market", "vendor_type": "WHOLESALER", "phone": "08022222222", "address": "Owerri, Imo", "trust_score": Decimal("4.5"), "is_verified": True},
    {"name": "New Market Vendors", "vendor_type": "MARKET", "phone": "08033333333", "address": "Enugu, Enugu", "trust_score": Decimal("4.2"), "is_verified": True},
]

for vendor_data in vendors_data:
    vendor, created = Vendor.objects.get_or_create(name=vendor_data["name"], defaults=vendor_data)
    if created:
        print(f"✅ Created vendor: {vendor.name}")

# Create Vendor Prices
tomatoes = Product.objects.get(name="Tomatoes")
onions = Product.objects.get(name="Onions")
pepper = Product.objects.get(name="Pepper")
rice = Product.objects.get(name="Rice (Local)")

mama_chidi = Vendor.objects.get(name="Mama Chidi's Farm")
owerri_market = Vendor.objects.get(name="Owerri Wholesale Market")
new_market = Vendor.objects.get(name="New Market Vendors")

prices_data = [
    {"vendor": mama_chidi, "product": tomatoes, "price": Decimal("800.00")},
    {"vendor": owerri_market, "product": tomatoes, "price": Decimal("750.00")},
    {"vendor": new_market, "product": tomatoes, "price": Decimal("850.00")},
    
    {"vendor": mama_chidi, "product": onions, "price": Decimal("600.00")},
    {"vendor": owerri_market, "product": onions, "price": Decimal("580.00")},
    
    {"vendor": mama_chidi, "product": pepper, "price": Decimal("500.00")},
    {"vendor": new_market, "product": pepper, "price": Decimal("480.00")},
    
    {"vendor": owerri_market, "product": rice, "price": Decimal("45000.00")},
    {"vendor": new_market, "product": rice, "price": Decimal("47000.00")},
]

for price_data in prices_data:
    price, created = VendorPrice.objects.get_or_create(**price_data)
    if created:
        print(f"✅ Created price: {price.product.name} - {price.vendor.name}: ₦{price.price}")

print("\n🎉 Sample data initialized successfully!")
print("\n📊 Summary:")
print(f"   Clusters: {Cluster.objects.count()}")
print(f"   Categories: {Category.objects.count()}")
print(f"   Products: {Product.objects.count()}")
print(f"   Vendors: {Vendor.objects.count()}")
print(f"   Vendor Prices: {VendorPrice.objects.count()}")
print("\n✨ You can now:")
print("   1. Visit http://localhost:8000/admin to see the data")
print("   2. Use the API to fetch products and prices")
print("   3. Create orders through the API")
