from django.core.urlresolvers import reverse
from django.db import models

from allauth import app_settings as allauth_app_settings


class RecordsKeeper(object):

    def __init__(self, campaign):
        self.campaign = campaign
        self.records = campaign.campaignrecord_set

    def times_opened(self):
        query = self.records.aggregate(models.Sum('times_opened'))
        return query.get('times_opened__sum') or 0

    def successful_seen_email_count(self):
        return self.records.filter(was_sent=True, times_opened__gt=0).count()

    def successful_email_count(self):
        return self.records.filter(was_sent=True).count()

    def unsuccessful_email_count(self):
        return self.records.filter(was_sent=False).count()


class Campaign(models.Model):

    email = models.CharField(max_length=255)

    title = models.CharField(max_length=255)

    subject = models.CharField(max_length=255)

    contacts = models.ManyToManyField(
        'contacts.Contact',
        through='contacts.ContactsList',
    )

    body = models.TextField()

    user = models.ForeignKey(
        allauth_app_settings.USER_MODEL, related_name='campaigns')

    datetime_sent = models.DateTimeField(null=True, default=None)

    @property
    def records(self):
        if not hasattr(self, '_records'):
            self._records = RecordsKeeper(self)
        return self._records

    def was_sent(self):
        return bool(self.datetime_sent)

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

    was_sent = models.BooleanField(default=False)

    def increment_opened(self):
        self.times_opened += 1
        self.save()
        return self.times_opened
