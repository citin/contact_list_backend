from django.db import models

from allauth import app_settings as allauth_app_settings
from taggit.managers import TaggableManager

from applications.campaigns.models import Campaign


class Contact(models.Model):

    name = models.CharField(max_length=255)

    tags = TaggableManager()

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
