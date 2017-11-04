from django.conf.urls import url, include
from django.contrib import admin

from rest_framework import routers

from applications.campaigns.views import CampaignViewSet
from applications.contacts.views import ContactViewSet

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

router.register(r'contacts', ContactViewSet)
router.register(r'contacts', CampaignViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include(router.urls)),
]
