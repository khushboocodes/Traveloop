from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from .models import (
    Destination, Activity, Trip, TripStop, TripActivity,
    Expense, Note, PackingItem, CommunityPost, SharedItinerary
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, DestinationSerializer,
    ActivitySerializer, TripListSerializer, TripDetailSerializer,
    TripStopSerializer, TripActivitySerializer, ExpenseSerializer,
    NoteSerializer, PackingItemSerializer, CommunityPostSerializer,
    SharedItinerarySerializer, AdminStatsSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Destination.objects.all()
        region = self.request.query_params.get('region')
        country = self.request.query_params.get('country')
        search = self.request.query_params.get('search')

        if region:
            queryset = queryset.filter(region__iexact=region)
        if country:
            queryset = queryset.filter(country__icontains=country)
        if search:
            queryset = queryset.filter(city__icontains=search)
        return queryset


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Activity.objects.all()
        city = self.request.query_params.get('city')
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if city:
            queryset = queryset.filter(city__icontains=city)
        if category:
            queryset = queryset.filter(category__iexact=category)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return TripListSerializer
        return TripDetailSerializer

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        status_filter = request.query_params.get('status')
        trips = self.get_queryset()
        if status_filter:
            trips = trips.filter(status=status_filter)
        serializer = TripListSerializer(trips, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        trips = self.get_queryset()
        stats = {
            'total': trips.count(),
            'upcoming': trips.filter(status='upcoming').count(),
            'ongoing': trips.filter(status='ongoing').count(),
            'completed': trips.filter(status='completed').count(),
            'planning': trips.filter(status='planning').count(),
        }
        return Response(stats)


class TripStopViewSet(viewsets.ModelViewSet):
    serializer_class = TripStopSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trip_id = self.kwargs.get('trip_pk')
        return TripStop.objects.filter(trip_id=trip_id, trip__user=self.request.user)

    def perform_create(self, serializer):
        trip_id = self.kwargs.get('trip_pk')
        trip = Trip.objects.get(id=trip_id, user=self.request.user)
        serializer.save(trip=trip)


class TripActivityViewSet(viewsets.ModelViewSet):
    serializer_class = TripActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        stop_id = self.kwargs.get('stop_pk')
        return TripActivity.objects.filter(trip_stop_id=stop_id, trip_stop__trip__user=self.request.user)

    def perform_create(self, serializer):
        stop_id = self.kwargs.get('stop_pk')
        stop = TripStop.objects.get(id=stop_id, trip__user=self.request.user)
        serializer.save(trip_stop=stop)


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trip_id = self.request.query_params.get('trip')
        expenses = Expense.objects.filter(trip__user=self.request.user)
        if trip_id:
            expenses = expenses.filter(trip_id=trip_id)
        return expenses

    def perform_create(self, serializer):
        trip_id = self.request.data.get('trip')
        trip = Trip.objects.get(id=trip_id, user=self.request.user)
        serializer.save(trip=trip)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        trip_id = request.query_params.get('trip')
        expenses = Expense.objects.filter(trip__user=self.request.user)
        if trip_id:
            expenses = expenses.filter(trip_id=trip_id)
        by_cat = expenses.values('category').annotate(
            total=Sum('amount'), count=Count('id')
        )
        return Response(by_cat)


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PackingItemViewSet(viewsets.ModelViewSet):
    queryset = PackingItem.objects.all()
    serializer_class = PackingItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trip_id = self.request.query_params.get('trip')
        items = PackingItem.objects.filter(user=self.request.user)
        if trip_id:
            items = items.filter(trip_id=trip_id)
        return items

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def reset_all(self, request):
        PackingItem.objects.filter(user=request.user).update(is_packed=False)
        return Response({'message': 'All items reset'})

    @action(detail=False, methods=['get'])
    def progress(self, request):
        items = PackingItem.objects.filter(user=request.user)
        total = items.count()
        packed = items.filter(is_packed=True).count()
        return Response({
            'total': total,
            'packed': packed,
            'progress': (packed / total * 100) if total > 0 else 0
        })


class CommunityPostViewSet(viewsets.ModelViewSet):
    queryset = CommunityPost.objects.all()
    serializer_class = CommunityPostSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes += 1
        post.save()
        return Response({'likes': post.likes})

    @action(detail=True, methods=['post'])
    def save(self, request, pk=None):
        post = self.get_object()
        post.saves += 1
        post.save()
        return Response({'saves': post.saves})


class SharedItineraryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SharedItinerary.objects.all()
    serializer_class = SharedItinerarySerializer
    permission_classes = [AllowAny]


class AdminStatsView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        stats = {
            'total_users': User.objects.count(),
            'total_trips': Trip.objects.count(),
            'total_bookings': Expense.objects.count(),
            'revenue': Expense.objects.aggregate(Sum('amount'))['amount__sum'] or 0,
        }
        serializer = AdminStatsSerializer(stats)
        return Response(serializer.data)


class AdminUsersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()


class AdminTripsView(generics.ListAPIView):
    serializer_class = TripListSerializer
    permission_classes = [IsAdminUser]
    queryset = Trip.objects.select_related('user').all()


class PublicItineraryView(generics.RetrieveAPIView):
    serializer_class = TripDetailSerializer
    permission_classes = [AllowAny]
    queryset = Trip.objects.filter(is_public=True)