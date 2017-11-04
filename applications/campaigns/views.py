from rest_framework import viewsets

from applications.campaigns.models import Campaign
from applications.campaigns.serializers import CampaignSerializer


class CampaignViewSet(viewsets.ModelViewSet):

    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    def update(self, request, *args, **kwargs):
        import pdb; pdb.set_trace();
