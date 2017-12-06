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

    def contacts_emails(self):
        return self.contacts.all().values_list('email', flat=True)


class CampaignTemplate(models.Model):

    body = models.TextField()
