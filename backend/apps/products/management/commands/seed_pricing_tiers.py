from django.core.management.base import BaseCommand
from apps.pricing.models import PricingTier


class Command(BaseCommand):
    help = 'Seeds default cluster group-buying discount tiers'

    def handle(self, *args, **kwargs):
        if PricingTier.objects.exists():
            self.stdout.write('Pricing tiers already seeded — skipping.')
            return

        tiers = [
            (0, '0.00', ''),
            (10, '8.00', 'Bulk Saver'),
            (25, '15.00', 'Cluster Deal'),
            (50, '22.00', 'Best Price'),
        ]

        for min_quantity, discount_percentage, label in tiers:
            PricingTier.objects.create(
                min_quantity=min_quantity,
                discount_percentage=discount_percentage,
                label=label,
            )

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(tiers)} pricing tiers.'))
