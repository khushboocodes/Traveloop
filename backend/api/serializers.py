from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Destination, Activity, Trip, TripStop, TripActivity,
    Expense, Note, PackingItem, CommunityPost, SharedItinerary
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'avatar', 'bio', 'city', 'phone', 'join_date', 'is_admin']
        read_only_fields = ['id', 'join_date', 'is_admin']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm',
                  'first_name', 'last_name', 'city', 'phone', 'avatar']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class TripActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TripActivity
        fields = '__all__'


class TripStopSerializer(serializers.ModelSerializer):
    activities = TripActivitySerializer(many=True, read_only=True)

    class Meta:
        model = TripStop
        fields = '__all__'


class TripListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['id', 'name', 'destination', 'cover_image', 'start_date',
                  'end_date', 'budget', 'spent', 'travelers', 'status', 'description']


class TripDetailSerializer(serializers.ModelSerializer):
    stops = TripStopSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'


class PackingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackingItem
        fields = '__all__'


class CommunityPostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CommunityPost
        fields = '__all__'


class SharedItinerarySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    trip = TripDetailSerializer(read_only=True)

    class Meta:
        model = SharedItinerary
        fields = '__all__'


class AdminStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_trips = serializers.IntegerField()
    total_bookings = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)