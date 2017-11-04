from django.db import models

from tagulous.models import TagField

from applications.campaigns.models import Campaign


class Contact(models.Model):

    name = models.CharField(max_length=255)

    tags = TagField()

    email = models.EmailField(max_length=255)

    phone = models.CharField(max_length=100)

    # TODO: add belongs_to user and unique_together = ('email', 'user')


class ContactsList(models.Model):

    contact = models.ForeignKey(Contact, related_name='contacts_list')
    campaign = models.ForeignKey(Campaign, related_name='contacts_list')

    class Meta:
        unique_together = ('contact', 'campaign')
