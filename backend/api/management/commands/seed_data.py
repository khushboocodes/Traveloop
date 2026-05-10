from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Destination, Activity, Trip, TripStop, Expense, Note, PackingItem, CommunityPost, SharedItinerary
from datetime import date, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating users...')
        user, created = User.objects.get_or_create(
            email='alex@example.com',
            defaults={
                'username': 'alexjohnson',
                'first_name': 'Alex',
                'last_name': 'Johnson',
                'city': 'Seattle',
                'bio': 'Digital nomad | 50+ countries | Adventure photographer'
            }
        )
        if created:
            user.set_password('password123')
            user.save()

        admin, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()

        self.stdout.write('Creating destinations...')
        destinations_data = [
            {'city': 'Paris', 'country': 'France', 'region': 'Europe', 'image': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', 'popularity': 98, 'cost_estimate': 2500, 'description': 'The City of Light, known for art, fashion, and gastronomy.'},
            {'city': 'Tokyo', 'country': 'Japan', 'region': 'Asia', 'image': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', 'popularity': 95, 'cost_estimate': 2200, 'description': 'A fascinating blend of traditional culture and cutting-edge technology.'},
            {'city': 'New York', 'country': 'United States', 'region': 'North America', 'image': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', 'popularity': 97, 'cost_estimate': 3000, 'description': 'The city that never sleeps, full of iconic landmarks and culture.'},
            {'city': 'Barcelona', 'country': 'Spain', 'region': 'Europe', 'image': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80', 'popularity': 92, 'cost_estimate': 1800, 'description': 'Stunning architecture, beaches, and vibrant nightlife.'},
            {'city': 'Bali', 'country': 'Indonesia', 'region': 'Asia', 'image': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', 'popularity': 90, 'cost_estimate': 1200, 'description': 'Tropical paradise with temples, rice terraces, and beaches.'},
            {'city': 'Dubai', 'country': 'United Arab Emirates', 'region': 'Middle East', 'image': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', 'popularity': 94, 'cost_estimate': 2800, 'description': 'Modern luxury, shopping, and futuristic architecture.'},
            {'city': 'Rome', 'country': 'Italy', 'region': 'Europe', 'image': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', 'popularity': 93, 'cost_estimate': 2000, 'description': 'The Eternal City with ancient ruins and incredible art.'},
            {'city': 'Sydney', 'country': 'Australia', 'region': 'Oceania', 'image': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80', 'popularity': 89, 'cost_estimate': 3200, 'description': 'Iconic harbor, beaches, and vibrant culture.'},
            {'city': 'Santorini', 'country': 'Greece', 'region': 'Europe', 'image': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', 'popularity': 88, 'cost_estimate': 2100, 'description': 'Stunning sunsets, white buildings, and azure waters.'},
            {'city': 'Cape Town', 'country': 'South Africa', 'region': 'Africa', 'image': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80', 'popularity': 85, 'cost_estimate': 1600, 'description': 'Mountains, beaches, and rich cultural heritage.'},
        ]
        for d in destinations_data:
            Destination.objects.get_or_create(city=d['city'], defaults=d)

        self.stdout.write('Creating activities...')
        activities_data = [
            {'name': 'Eiffel Tower Visit', 'city': 'Paris', 'country': 'France', 'category': 'Culture', 'rating': 4.8, 'reviews': 12500, 'duration': '3 hours', 'cost': 45, 'image': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800&q=80', 'description': 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris.'},
            {'name': 'Sushi Making Class', 'city': 'Tokyo', 'country': 'Japan', 'category': 'Food', 'rating': 4.9, 'reviews': 3200, 'duration': '2 hours', 'cost': 65, 'image': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80', 'description': 'Learn to make authentic sushi from a Japanese master chef.'},
            {'name': 'Central Park Bike Tour', 'city': 'New York', 'country': 'United States', 'category': 'Adventure', 'rating': 4.7, 'reviews': 8900, 'duration': '4 hours', 'cost': 55, 'image': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80', 'description': 'Explore Central Park on a guided bike tour.'},
            {'name': 'Sagrada Familia Tour', 'city': 'Barcelona', 'country': 'Spain', 'category': 'Culture', 'rating': 4.9, 'reviews': 15600, 'duration': '2 hours', 'cost': 35, 'image': 'https://images.unsplash.com/photo-1583779457711-ab6da3c4cdbf?w=800&q=80', 'description': "Visit Gaudi's masterpiece, the stunning Sagrada Familia."},
            {'name': 'Temple Hopping Tour', 'city': 'Bali', 'country': 'Indonesia', 'category': 'Culture', 'rating': 4.6, 'reviews': 6700, 'duration': '8 hours', 'cost': 40, 'image': 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80', 'description': 'Visit the most beautiful temples in Bali with a local guide.'},
        ]
        for a in activities_data:
            Activity.objects.get_or_create(name=a['name'], defaults=a)

        self.stdout.write('Creating trips...')
        trip1, _ = Trip.objects.get_or_create(
            name='European Summer Adventure',
            user=user,
            defaults={
                'destination': 'Paris, Barcelona, Rome',
                'cover_image': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
                'start_date': date(2026, 7, 15),
                'end_date': date(2026, 7, 28),
                'budget': 5500,
                'spent': 4200,
                'travelers': 2,
                'status': 'upcoming',
                'description': 'A two-week journey through the most iconic European cities.'
            }
        )

        trip2, _ = Trip.objects.get_or_create(
            name='Bali Wellness Retreat',
            user=user,
            defaults={
                'destination': 'Bali',
                'cover_image': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
                'start_date': date(2026, 5, 1),
                'end_date': date(2026, 5, 10),
                'budget': 2200,
                'spent': 2100,
                'travelers': 1,
                'status': 'ongoing',
                'description': 'A healing journey through Bali temples and beaches.'
            }
        )

        self.stdout.write('Creating trip stops...')
        stop1, _ = TripStop.objects.get_or_create(
            trip=trip1, city='Paris', country='France',
            defaults={
                'start_date': date(2026, 7, 15),
                'end_date': date(2026, 7, 20),
                'budget': 1500,
                'notes': 'Morning visits to avoid crowds.',
                'order': 1
            }
        )

        self.stdout.write('Creating expenses...')
        expenses_data = [
            {'trip': trip1, 'category': 'flights', 'description': 'Round trip flights to Paris', 'amount': 850, 'date': date(2026, 4, 15)},
            {'trip': trip1, 'category': 'accommodation', 'description': 'Hotel Le Marais (5 nights)', 'amount': 720, 'date': date(2026, 4, 15)},
            {'trip': trip1, 'category': 'food', 'description': 'Welcome dinner at Le Comptoir', 'amount': 95, 'date': date(2026, 4, 16)},
            {'trip': trip2, 'category': 'activities', 'description': 'Yoga retreat session', 'amount': 30, 'date': date(2026, 5, 1)},
        ]
        for e in expenses_data:
            Expense.objects.get_or_create(
                trip=e['trip'], description=e['description'],
                defaults={k: v for k, v in e.items() if k != 'trip'}
            )

        self.stdout.write('Creating notes...')
        Note.objects.get_or_create(
            user=user, title='Paris Restaurant Recommendations',
            defaults={
                'content': 'Le Comptoir du Panthéon - amazing French cuisine near the Latin Quarter.',
                'tags': ['food', 'paris', 'recommendations'],
                'location': 'Paris, France'
            }
        )

        self.stdout.write('Creating packing items...')
        packing_data = [
            {'category': 'documents', 'name': 'Passport', 'is_packed': True},
            {'category': 'documents', 'name': 'Travel Insurance', 'is_packed': True},
            {'category': 'clothing', 'name': 'T-Shirts (5)', 'is_packed': False},
            {'category': 'electronics', 'name': 'Phone Charger', 'is_packed': True},
            {'category': 'toiletries', 'name': 'Toothbrush & Toothpaste', 'is_packed': True},
        ]
        for p in packing_data:
            PackingItem.objects.get_or_create(user=user, name=p['name'], defaults=p)

        self.stdout.write('Creating community posts...')
        CommunityPost.objects.get_or_create(
            destination='Santorini, Greece',
            user=user,
            defaults={
                'images': ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80'],
                'caption': 'The most stunning sunset of my life! Santorini exceeded all expectations.',
                'likes': 284,
                'saves': 56,
                'trip_name': 'Greek Islands Adventure'
            }
        )

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
        self.stdout.write(f'Login credentials: alex@example.com / password123')
        self.stdout.write(f'Admin credentials: admin@example.com / admin123')