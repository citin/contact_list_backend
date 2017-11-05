from django.db import models


class Campaign(models.Model):

    title = models.CharField(max_length=255)

    contacts = models.ManyToManyField(
        'contacts.Contact',
        through='contacts.ContactsList',
    )

    body = models.TextField()


class CampaignTemplate(models.Model):

    body = models.TextField()
