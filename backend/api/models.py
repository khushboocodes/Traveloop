from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """Custom user model with travel-related fields"""
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    join_date = models.DateField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        ordering = ['-date_joined']


class Destination(models.Model):
    """Destinations that users can search and add to trips"""
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    image = models.URLField()
    popularity = models.IntegerField(default=0)
    cost_estimate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-popularity']

    def __str__(self):
        return f"{self.city}, {self.country}"


class Activity(models.Model):
    """Activities available at destinations"""
    CATEGORY_CHOICES = [
        ('Culture', 'Culture'),
        ('Food', 'Food'),
        ('Adventure', 'Adventure'),
        ('Relaxation', 'Relaxation'),
    ]

    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    reviews = models.IntegerField(default=0)
    duration = models.CharField(max_length=50)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-rating']

    def __str__(self):
        return self.name


class Trip(models.Model):
    """User's travel trips"""
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    name = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    cover_image = models.URLField(null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    travelers = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.name


class TripStop(models.Model):
    """Stops/cities within a trip itinerary"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'start_date']

    def __str__(self):
        return f"{self.city} - {self.trip.name}"


class TripActivity(models.Model):
    """Activities within a trip stop"""
    trip_stop = models.ForeignKey(TripStop, on_delete=models.CASCADE, related_name='activities')
    name = models.CharField(max_length=200)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    activity = models.ForeignKey(Activity, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class Expense(models.Model):
    """Trip expenses"""
    CATEGORY_CHOICES = [
        ('flights', 'Flights'),
        ('accommodation', 'Accommodation'),
        ('food', 'Food & Dining'),
        ('activities', 'Activities'),
        ('transport', 'Transportation'),
        ('shopping', 'Shopping'),
    ]

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.description} - ${self.amount}"


class Note(models.Model):
    """Travel notes/journals"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='notes', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200)
    content = models.TextField()
    tags = models.JSONField(default=list)
    location = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class PackingItem(models.Model):
    """Packing list items"""
    CATEGORY_CHOICES = [
        ('documents', 'Documents'),
        ('clothing', 'Clothing'),
        ('electronics', 'Electronics'),
        ('toiletries', 'Toiletries & Essentials'),
        ('misc', 'Miscellaneous'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='packing_items')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='packing_items', null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=200)
    is_packed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return self.name


class CommunityPost(models.Model):
    """Community shared posts"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    destination = models.CharField(max_length=200)
    images = models.JSONField(default=list)
    caption = models.TextField()
    likes = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    trip_name = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.destination}"


class SharedItinerary(models.Model):
    """Publicly shared trip itineraries"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_itineraries')
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name='shared_itinerary')
    likes = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Shared: {self.trip.name}"