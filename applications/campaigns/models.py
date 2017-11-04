from django.db import models

from applications.contacts.models import ContactsList


class Campaign(models.Model):

    title = models.CharField(max_length=255)

    contacts_list = models.ForeignKey(
        ContactsList,
        null=True,
        related_name='campaigns'
    )

    body = models.TextField()


class CampaignTemplate(models.Model):

    body = models.TextField()
