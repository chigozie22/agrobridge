from rest_framework import serializers
from .models import Delivery

class DeliverySerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    courier_name = serializers.CharField(source='courier.name', read_only=True)
    
    class Meta:
        model = Delivery
        fields = '__all__'
