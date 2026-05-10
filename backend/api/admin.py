from django.contrib import admin
from .models import (
    User,
    Destination,
    Activity,
    Trip,
    TripStop,
    TripActivity,
    Expense,
    Note,
    PackingItem,
    CommunityPost,
    SharedItinerary
)

admin.site.register(User)
admin.site.register(Destination)
admin.site.register(Activity)
admin.site.register(Trip)
admin.site.register(TripStop)
admin.site.register(TripActivity)
admin.site.register(Expense)
admin.site.register(Note)
admin.site.register(PackingItem)
admin.site.register(CommunityPost)
admin.site.register(SharedItinerary)