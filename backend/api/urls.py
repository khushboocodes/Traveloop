from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserProfileView, DestinationViewSet, ActivityViewSet,
    TripViewSet, TripStopViewSet, TripActivityViewSet, ExpenseViewSet,
    NoteViewSet, PackingItemViewSet, CommunityPostViewSet, SharedItineraryViewSet,
    AdminStatsView, AdminUsersView, AdminTripsView, PublicItineraryView
)

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'trips', TripViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'packing', PackingItemViewSet)
router.register(r'community', CommunityPostViewSet)
router.register(r'shared-itineraries', SharedItineraryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('admin/users/', AdminUsersView.as_view(), name='admin_users'),
    path('admin/trips/', AdminTripsView.as_view(), name='admin_trips'),
    path('public/trips/<int:pk>/', PublicItineraryView.as_view(), name='public_itinerary'),
    path('trips/<int:trip_pk>/stops/', TripStopViewSet.as_view({'get': 'list', 'post': 'create'}), name='trip_stops'),
    path('trips/<int:trip_pk>/stops/<int:pk>/', TripStopViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='trip_stop_detail'),
    path('stops/<int:stop_pk>/activities/', TripActivityViewSet.as_view({'get': 'list', 'post': 'create'}), name='stop_activities'),
    path('stops/<int:stop_pk>/activities/<int:pk>/', TripActivityViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='stop_activity_detail'),
]