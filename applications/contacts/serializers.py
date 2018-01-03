from rest_framework import serializers
from taggit_serializer.serializers import TagListSerializerField
from taggit_serializer.serializers import TaggitSerializer

from applications.contacts.models import Contact


class ContactSerializer(TaggitSerializer, serializers.ModelSerializer):

    tags = TagListSerializerField()

    class Meta:
        model = Contact
        fields = ('id', 'name', 'email', 'phone', 'tags')
        read_only_fields = ('id',)

    def validate_email(self, value):
        if self.context['request'].method == 'PUT':
            return value
        user = self.context['request'].user
        if user.contacts.filter(email=value).exists():
            raise serializers.ValidationError(
                'No puede crear dos contactos con el mismo email.'
            )
        return value

