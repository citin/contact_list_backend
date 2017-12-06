from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.generic import View

from rest_framework import viewsets

from applications.campaigns.models import Campaign
from applications.campaigns.serializers import CampaignSerializer


class CampaignViewSet(viewsets.ModelViewSet):

    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SendCampaignView(View):

    http_method_names = ['post']

    def post(self, request, *args, **kwargs):

        campaign = Campaign.objects.get(pk=self.kwargs['pk'])

        sent = send_mail(
            campaign.subject,
            campaign.body,
            campaign.user.email,
            campaign.contacts_emails(),
            fail_silently=False,
        )

        return JsonResponse({'sent': bool(sent)})
