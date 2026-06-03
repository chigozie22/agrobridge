from django.core.management.base import BaseCommand
from apps.products.models import Product, Combo, ComboItem, ComboMealSuggestion


class Command(BaseCommand):
    help = 'Seeds the database with real AgroBridge food combo packages'

    def handle(self, *args, **kwargs):
        if Combo.objects.exists():
            self.stdout.write('Combos already seeded — skipping.')
            return
        self.stdout.write('Seeding 5 real combos...')

        def p(name):
            try:
                return Product.objects.get(name=name)
            except Product.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'  ⚠ Product not found: {name}'))
                return None

        combos_data = [
            # ─────────────────────────────────────────────────────────
            {
                'name': '₦15K Budget Combo',
                'description': 'Essential student staples to survive the month on a tight budget',
                'price': 15000,
                'feeds': '1 person',
                'duration': '3-4 weeks',
                'meals_count': 42,
                'use_case': 'students',
                'badge': 'value',
                'is_featured': True,
                'featured_order': 2,
                'items': [
                    ('Indomie Instant Noodles',  '10 packs',         10,   'packs',   'Main quick meal'),
                    ('Golden Penny Spaghetti',   '2 packs',           2,   'packs',   None),
                    ('Eggs',                     '5 pieces',          5,   'pieces',  'Protein with noodles'),
                    ('Gino Tomato Paste',        '1 roll',            1,   'roll',    'For sauce'),
                    ('Groundnut Oil',            '1 small bottle',  0.5,  'litres',  None),
                    ('Maggi/Knorr Seasoning',    '1 pack',            1,   'pack',    None),
                    ('Red Pepper',               'enough quantity',   None, '',        None),
                    ('Red Onions',               'enough quantity',   None, '',        None),
                    ('Curry Powder',             '1 pack',            1,   'pack',    'Gino curry'),
                    ('White Yam',                '1 tuber',           1,   'tuber',   None),
                    ('Brown Beans',              '3 cups',            3,   'cups',    None),
                ],
                'meals': [
                    ('Indomie Noodles',          '10-12 times'),
                    ('Spaghetti & Egg Sauce',    '4-5 times'),
                    ('Yam & Egg Sauce',          '3-4 times'),
                    ('Beans Porridge',           '3-4 times'),
                ],
            },
            # ─────────────────────────────────────────────────────────
            {
                'name': '₦40K Food Combo Package',
                'description': 'A balanced mix of staples, cereals, and pantry essentials for families',
                'price': 40000,
                'feeds': '2-3 people',
                'duration': '3-4 weeks',
                'meals_count': 70,
                'use_case': 'families',
                'badge': 'popular',
                'is_featured': True,
                'featured_order': 1,
                'items': [
                    ('Milo',                     '1 roll',            1,   'roll',    None),
                    ('Peak Milk',                '1 roll',            1,   'roll',    None),
                    ('Crayfish',                 '1 cup',             1,   'cups',    None),
                    ('Long Grain Rice',          '½ paint',           1,   'paint',   '~5kg'),
                    ('Indomie Instant Noodles',  '½ carton',         18,   'packs',   'Half carton'),
                    ('Golden Penny Spaghetti',   '½ carton',          6,   'packs',   'Half carton'),
                    ('Cornflakes',               '1 custard cup',     1,   'cup',     None),
                    ('Golden Morn',              '1 big sachet',      1,   'sachet',  None),
                    ('Gino Tomato Paste',        '2 rolls',           2,   'rolls',   None),
                    ('Garri',                    '1 paint',           1,   'paint',   '~5kg'),
                    ('Maggi/Knorr Seasoning',    '1 full pack',       1,   'pack',    'Includes salt'),
                    ('Maggi/Knorr Seasoning',    '1 roll mixed',      1,   'roll',    'Mixed seasonings'),
                ],
                'meals': [
                    ('Jollof Rice',              '5-6 times'),
                    ('Indomie Noodles',          '8-10 times'),
                    ('Spaghetti & Stew',         '3-4 times'),
                    ('Cornflakes / Golden Morn', '10+ breakfasts'),
                    ('Eba & Soup',               '4-5 times'),
                ],
            },
            # ─────────────────────────────────────────────────────────
            {
                'name': '₦20K Student Essentials Pack',
                'description': 'Yam, eggs, noodles and cereals — everything a student needs for 2 weeks',
                'price': 20000,
                'feeds': '1 person',
                'duration': '2 weeks',
                'meals_count': 30,
                'use_case': 'students',
                'badge': 'new',
                'is_featured': True,
                'featured_order': 3,
                'items': [
                    ('White Yam',                '2 tubers',          2,   'tubers',  None),
                    ('Eggs',                     '15 pieces',        15,   'pieces',  'Half crate'),
                    ('Indomie Instant Noodles',  '½ carton super',   18,   'packs',   'Half carton superpack'),
                    ('Ripe Plantain',            '1 bunch',           1,   'bunch',   None),
                    ('Cornflakes',               '1 custard cup',     1,   'cup',     None),
                    ('Golden Morn',              '1 custard cup',     1,   'cup',     None),
                ],
                'meals': [
                    ('Yam & Egg Sauce',          '6-8 times'),
                    ('Indomie Noodles',          '10-12 times'),
                    ('Fried Plantain & Egg',     '3-4 times'),
                    ('Cornflakes / Golden Morn', '7-10 breakfasts'),
                ],
            },
            # ─────────────────────────────────────────────────────────
            {
                'name': '₦82,800 Premium Food Combo',
                'description': 'Complete 4-7 week supply — rice, beans, milo, milk and all pantry essentials',
                'price': 82800,
                'feeds': '2-3 people',
                'duration': '4-7 weeks',
                'meals_count': 120,
                'use_case': 'families',
                'badge': 'premium',
                'is_featured': False,
                'featured_order': 0,
                'items': [
                    ('Long Grain Rice',          '3 paints',          3,   'paints',  '~15kg'),
                    ('Brown Beans',              '3 paints',          3,   'paints',  '~15kg'),
                    ('Gino Tomato Paste',        '5 rolls',           5,   'rolls',   None),
                    ('Milo',                     '3 rolls',           3,   'rolls',   None),
                    ('Peak Milk',                '3 rolls',           3,   'rolls',   None),
                    ('Indomie Instant Noodles',  '½ carton',         18,   'packs',   None),
                    ('Golden Penny Spaghetti',   '½ carton',          6,   'packs',   None),
                    ('White Yam',                '2 tubers',          2,   'tubers',  None),
                    ('Sugar',                    '1 cube pack',       1,   'pack',    None),
                    ('Palm Oil',                 '1 small bottle',  0.5,  'litres',  None),
                    ('Groundnut Oil',            '1 small bottle',  0.5,  'litres',  None),
                    ('Cornflakes',               '1 custard cup',     1,   'cup',     None),
                    ('Golden Morn',              '1 custard cup',     1,   'cup',     None),
                    ('Maggi/Knorr Seasoning',    '1 full pack',       1,   'pack',    None),
                    ('Red Onions',               'enough quantity',  None,  '',        None),
                    ('Red Pepper',               'enough quantity',  None,  '',        'Dry pepper'),
                    ('Crayfish',                 '1 cup',             1,   'cup',     None),
                ],
                'meals': [
                    ('Jollof Rice',              '12-15 times'),
                    ('Rice & Beans',             '8-10 times'),
                    ('Milo / Tea with Milk',     '30+ cups'),
                    ('Spaghetti & Stew',         '5-6 times'),
                    ('Yam Porridge',             '4-5 times'),
                    ('Cornflakes / Golden Morn', '14+ breakfasts'),
                ],
            },
            # ─────────────────────────────────────────────────────────
            {
                'name': '₦64,900 Back to School Pack',
                'description': 'Everything you need to stock up before heading back to school',
                'price': 64900,
                'feeds': '1-2 people',
                'duration': '4-6 weeks',
                'meals_count': 90,
                'use_case': 'students',
                'badge': None,
                'is_featured': False,
                'featured_order': 0,
                'items': [
                    ('Long Grain Rice',          '3 paints',          3,   'paints',  '~15kg'),
                    ('Brown Beans',              '2 paints',          2,   'paints',  '~10kg'),
                    ('Garri',                    '3 paints',          3,   'paints',  '~15kg'),
                    ('Gino Tomato Paste',        '5 rolls',           5,   'rolls',   None),
                    ('Indomie Instant Noodles',  '½ carton',         18,   'packs',   None),
                    ('Golden Penny Spaghetti',   '½ carton',          6,   'packs',   None),
                    ('Sugar',                    '1 cube pack',       1,   'pack',    None),
                    ('Palm Oil',                 '2 medium bottles',  1,   'litres',  'Eva bottle size'),
                    ('Groundnut Oil',            '1 medium bottle', 0.75,  'litres',  'Eva bottle size'),
                    ('Maggi/Knorr Seasoning',    '1 full pack',       1,   'pack',    None),
                    ('Red Onions',               'enough quantity',  None,  '',        None),
                    ('Red Pepper',               'enough quantity',  None,  '',        'Dry pepper'),
                    ('Crayfish',                 '1 cup',             1,   'cup',     None),
                ],
                'meals': [
                    ('Jollof Rice',              '10-12 times'),
                    ('Rice & Beans',             '6-8 times'),
                    ('Eba / Garri Soaking',      '10+ times'),
                    ('Spaghetti & Stew',         '5-6 times'),
                    ('Indomie Noodles',          '10-12 times'),
                ],
            },
        ]

        for data in combos_data:
            combo = Combo.objects.create(
                name=data['name'],
                description=data['description'],
                price=data['price'],
                feeds=data['feeds'],
                duration=data['duration'],
                meals_count=data['meals_count'],
                use_case=data['use_case'],
                badge=data['badge'],
                is_featured=data['is_featured'],
                featured_order=data['featured_order'],
                is_active=True,
            )
            self.stdout.write(f'  ✓ {combo.name}')

            for i, (product_name, qty_text, qty_val, qty_unit, notes) in enumerate(data['items']):
                product = p(product_name)
                if product:
                    ComboItem.objects.create(
                        combo=combo,
                        product=product,
                        quantity_text=qty_text,
                        quantity_value=qty_val,
                        quantity_unit=qty_unit,
                        notes=notes or '',
                        order=i,
                    )

            for i, (meal_name, frequency) in enumerate(data['meals']):
                ComboMealSuggestion.objects.create(
                    combo=combo, meal_name=meal_name, frequency=frequency, order=i,
                )

        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(self.style.SUCCESS('✅ 5 real combos seeded!'))
        self.stdout.write('=' * 50 + '\n')
