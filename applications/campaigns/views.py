from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.generic import View
from django.http import HttpResponseForbidden

from rest_framework import viewsets

from applications.campaigns.models import Campaign
from applications.campaigns.models import CampaignRecord
from applications.campaigns.serializers import CampaignSerializer
from applications.contacts.models import Contact
from applications.contacts.models import ContactsList


class CampaignViewSet(viewsets.ModelViewSet):

    serializer_class = CampaignSerializer

    def get_queryset(self):
        return self.request.user.campaigns.all()

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        emails = serializer.initial_data['emails'].split(',')
        for email in emails:
            contact = Contact.objects.get(email=email)
            ContactsList.objects.create(campaign=instance,
                                        contact=contact)
        return instance


class SendCampaignView(View):

    http_method_names = ['post']

    def post(self, request, *args, **kwargs):

        campaign = Campaign.objects.get(pk=self.kwargs['pk'])

        if campaign.was_sent():
            return JsonResponse({
                'status': 'error',
                'error': 'Campaign Has Already been sent.'
            })
        else:

            for contact in campaign.contacts.all():

                sent = send_mail(campaign.subject,
                                 campaign.full_body(request, contact.id),
                                 campaign.user.email,
                                 [campaign.email],
                                 fail_silently=False)

                record, _ = CampaignRecord.objects.get_or_create(contact=contact,
                                              campaign=campaign)
                record.was_sent = bool(sent)
                record.save()

            return JsonResponse({'status': 'success'})


class TrackCampaignView(View):

    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        contact = Contact.objects.filter(pk=self.kwargs['user_id']).first()
        campaign = Campaign.objects.filter(pk=self.kwargs['pk']).first()
        record, _ = CampaignRecord.objects.get_or_create(contact=contact,
                                                         campaign=campaign)
        record.increment_opened()
        image_data = open(settings.STATIC_DIR + '/trackme.png', "rb").read()
        return HttpResponse(image_data, content_type="image/png")


class CampaignStatsView(View):
    http_method_names = ['get']

    def get(self, request, *args, **kwargs):

        campaign = Campaign.objects.get(pk=self.kwargs['pk'])

        record_data = {
            'datetime_sent': campaign.datetime_sent,
            'times_opened': campaign.records.times_opened(),
            'successful_seen_email_count': campaign.records.successful_seen_email_count(),
            'successful_email_count': campaign.records.successful_email_count(),
            'unsuccessful_email_count': campaign.records.unsuccessful_email_count(),
            'emails': [
                {
                    'contact': cr.contact.email,
                    'sent': cr.was_sent,
                    'seen': bool(cr.times_opened),
                    'seen_times': cr.times_opened,
                } for cr in campaign.campaignrecord_set.all()
            ]
        }

        return JsonResponse(record_data)


class SignInView(View):
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        password_confirmation = request.POST.get('password_confirmation', None)

        from django.contrib.auth import get_user_model
        if username is None or password != password_confirmation:
            return HttpResponseForbidden('invalid data')
        elif get_user_model().objects.filter(username=username).exists():
            return HttpResponseForbidden('username already in use')
        else:
            user = get_user_model().objects.create(username=username)
            user.set_password(password)
            user.save()
            # user.token = token.new()
            return JsonResponse({'status': 'success', 'data': 'success'})
