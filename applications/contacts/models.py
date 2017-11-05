from django.db import models

from tagulous.models import TagField

from applications.campaigns.models import Campaign
from allauth import app_settings as allauth_app_settings


class Contact(models.Model):

    name = models.CharField(max_length=255)

    tags = TagField(blank=True)

    email = models.EmailField(max_length=255)

    phone = models.CharField(max_length=100, null=True, blank=True)

    user = models.ForeignKey(
        allauth_app_settings.USER_MODEL, related_name='contacts')

    class Meta:
        unique_together = ('email', 'user')


class ContactsList(models.Model):

    contact = models.ForeignKey(Contact, related_name='contacts_list')
    campaign = models.ForeignKey(Campaign, related_name='contacts_list')

    class Meta:
        unique_together = ('contact', 'campaign')
