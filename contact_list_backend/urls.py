from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token

from applications.campaigns.views import CampaignViewSet
from applications.campaigns.views import SendCampaignView
from applications.contacts.views import ContactViewSet
from applications.contacts.views import ContactsByTags

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

router.register(r'contacts', ContactViewSet)
router.register(r'campaigns', CampaignViewSet)

urlpatterns = [
    url(r'^contacts_by_tags$', ContactsByTags.as_view()),
    url(r'^admin/', admin.site.urls),
    url(r'^campaigns/(?P<pk>\d+)/send/', SendCampaignView.as_view()),
    url(r'^api/', include(router.urls)),
    url(r'^api-token-auth/', obtain_jwt_token),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^$', TemplateView.as_view(template_name='home.html')),
]
