from functools import reduce
from operator import or_

from django.db import models

from allauth import app_settings as allauth_app_settings
from taggit.managers import TaggableManager

from applications.campaigns.models import Campaign


class ContactManager(models.Manager):

    def find_by_tags(self, tags):
        qs = super(ContactManager, self).get_queryset()
        tags_qs = reduce(or_, [
            models.Q(tags__name__contains=tag)
            for tag in tags
        ])
        return qs.filter(tags_qs)


class Contact(models.Model):

    name = models.CharField(max_length=255)

    tags = TaggableManager()

    email = models.EmailField(max_length=255)

    phone = models.CharField(max_length=100, null=True, blank=True)

    user = models.ForeignKey(
        allauth_app_settings.USER_MODEL, related_name='contacts')

    objects = ContactManager()

    class Meta:
        unique_together = ('email', 'user')

    def __str__(self):
        return self.email


class ContactsList(models.Model):

    contact = models.ForeignKey(Contact, related_name='contacts_list')
    campaign = models.ForeignKey(Campaign, related_name='contacts_list')

    class Meta:
        unique_together = ('contact', 'campaign')
