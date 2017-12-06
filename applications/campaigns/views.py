from django.conf import settings
from django.core.mail import send_mass_mail
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.generic import View

from rest_framework import viewsets

from applications.contacts.models import Contact
from applications.campaigns.models import Campaign
from applications.campaigns.models import CampaignRecord
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

        messages = []
        for contact in campaign.contacts.all():
            messages.append((campaign.subject,
                             campaign.full_body(request, contact.id),
                             campaign.user.email,
                             [contact.email]))

        sent = send_mass_mail(messages,
                              fail_silently=False)

        return JsonResponse({'sent': bool(sent)})


class TrackCampaignView(View):

    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        contact = Contact.objects.get(pk=self.kwargs['user_id'])
        campaign = Campaign.objects.get(pk=self.kwargs['pk'])
        record, _ = CampaignRecord.objects.get_or_create(contact=contact,
                                                         campaign=campaign)
        record.increment_opened()
        image_data = open(settings.STATIC_DIR + '/trackme.png', "rb").read()
        return HttpResponse(image_data, content_type="image/png")
