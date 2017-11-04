from django.db import models

from tagulous.models import TagField


class ContactsList(models.Model):

    title = models.CharField(max_length=255)


class Contact(models.Model):

    name = models.CharField(max_length=255)

    tags = TagField()

    email = models.EmailField(max_length=255)

    phone = models.CharField(max_length=100)

    contacts_list = models.ForeignKey(
        ContactsList,
        related_name='contacts'
    )

    class Meta:
        unique_together = ('email', 'contacts_list')
