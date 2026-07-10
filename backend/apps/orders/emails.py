from django.core.mail import send_mail
from django.conf import settings


def send_order_confirmation(order):
    """Email user when their order is placed."""
    if not order.user.email:
        return
    items_text = '\n'.join(
        f"  - {item.combo.name if item.combo else item.product.name} x{item.quantity}  ₦{item.subtotal:,.0f}"
        for item in order.items.all()
    )
    body = f"""Hi {order.user.name or 'there'},

Your AgroBridge order has been placed successfully!

Order #: {order.id}
Cluster: {order.cluster.name if order.cluster else '—'}
Delivery address: {order.delivery_address}

Items:
{items_text}

Delivery fee: ₦{order.delivery_fee:,.0f}
Total: ₦{order.total_amount:,.0f}

Track your order here: {settings.FRONTEND_URL}/orders/{order.id}

Thank you for choosing AgroBridge!
— The AgroBridge Team
"""
    try:
        send_mail(
            subject=f'AgroBridge — Order #{order.id} Confirmed',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=True,
        )
    except Exception:
        pass


def send_status_update(order):
    """Email user when their order status changes."""
    if not order.user.email:
        return
    status_messages = {
        'CONFIRMED':   'Great news! Your payment has been confirmed and your order is now active.',
        'PROCESSING':  'Our vendors are now packing your order.',
        'READY':       'Your order is packed and ready — it has been handed to the delivery rider.',
        'IN_TRANSIT':  'Your order is on the way! The rider is heading to your cluster.',
        'DELIVERED':   'Your order has been delivered. Enjoy your food!',
        'CANCELLED':   'Your order has been cancelled. Contact us if you have any questions.',
    }
    msg = status_messages.get(order.status)
    if not msg:
        return
    body = f"""Hi {order.user.name or 'there'},

{msg}

Order #: {order.id}
Status: {order.get_status_display()}

View your order: {settings.FRONTEND_URL}/orders/{order.id}

— The AgroBridge Team
"""
    try:
        send_mail(
            subject=f'AgroBridge — Order #{order.id}: {order.get_status_display()}',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=True,
        )
    except Exception:
        pass
