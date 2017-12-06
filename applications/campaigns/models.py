from django.core.urlresolvers import reverse
from django.db import models

from allauth import app_settings as allauth_app_settings


class Campaign(models.Model):

    title = models.CharField(max_length=255)

    subject = models.CharField(max_length=255)

    contacts = models.ManyToManyField(
        'contacts.Contact',
        through='contacts.ContactsList',
    )

    body = models.TextField()

    user = models.ForeignKey(
        allauth_app_settings.USER_MODEL, related_name='campaigns')

    def full_body(self, request, user_id):
        return '{body}<br>{track_url}'.format(body=self.body,
                                              track_url=self.track_url(request, user_id))

    def track_url(self, request, user_id):
        track_url = reverse('track-campaign',
                            kwargs={'pk': self.id,
                                    'user_id': user_id})
        return '<img src={track_url}/>'.format(
            track_url=request.build_absolute_uri(track_url))


class CampaignTemplate(models.Model):

    body = models.TextField()


class CampaignRecord(models.Model):

    campaign = models.ForeignKey(Campaign)

    contact = models.ForeignKey('contacts.Contact',
                                related_name='campaign_records')

    datetime = models.DateTimeField(auto_now_add=True)

    times_opened = models.PositiveIntegerField(default=0)

    def increment_opened(self):
        self.times_opened += 1
        self.save()
        return self.times_opened
