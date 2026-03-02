from rest_framework import serializers
from .models import Cluster

class ClusterSerializer(serializers.ModelSerializer):
    total_users = serializers.ReadOnlyField()
    active_users = serializers.ReadOnlyField()
    
    class Meta:
        model = Cluster
        fields = '__all__'
