"""
Location-aware sourcing: distance calculation shared by the products API
(display) and the Aggregation Engine (actual vendor selection).
"""
from decimal import Decimal
from math import radians, cos, sin, asin, sqrt

EARTH_RADIUS_KM = 6371

# How close a vendor must be to count as "local" to a cluster.
LOCAL_RADIUS_KM = 20

# How much more a local vendor is allowed to cost than the absolute
# cheapest available price and still be preferred, to cut logistics cost.
LOCAL_PRICE_TOLERANCE = Decimal('0.10')


def haversine_km(lat1, lon1, lat2, lon2):
    """Great-circle distance in km between two lat/lng points."""
    lat1, lon1, lat2, lon2 = (radians(float(v)) for v in (lat1, lon1, lat2, lon2))
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return EARTH_RADIUS_KM * 2 * asin(sqrt(a))


def distance_to_vendor(cluster, vendor):
    """
    Returns the distance in km between a cluster and a vendor, or None if
    either side lacks coordinates.
    """
    if cluster is None or vendor is None:
        return None
    if cluster.latitude is None or cluster.longitude is None:
        return None
    if vendor.latitude is None or vendor.longitude is None:
        return None
    return haversine_km(cluster.latitude, cluster.longitude, vendor.latitude, vendor.longitude)


def is_local_vendor(cluster, vendor):
    distance = distance_to_vendor(cluster, vendor)
    return distance is not None and distance <= LOCAL_RADIUS_KM
