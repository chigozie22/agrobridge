"""
Serializers for User model
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User
from apps.clusters.serializers import ClusterSerializer
from apps.clusters.models import Cluster


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    cluster = ClusterSerializer(read_only=True)
    cluster_id = serializers.PrimaryKeyRelatedField(
        queryset=Cluster.objects.all(),
        source='cluster',
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'phone', 'role',
            'cluster', 'cluster_id', 'address', 'avatar', 'date_joined'
        ]
        read_only_fields = ['id', 'email', 'role', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'phone', 'password', 'password_confirm', 'cluster']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
