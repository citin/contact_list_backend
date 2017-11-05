from rest_framework import serializers

from applications.contacts.models import Contact


class ContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contact
        fields = ('name', 'email', 'phone')

    def validate_email(self, value):
        user = self.context['request'].user
        if user.contacts.filter(email=value).exists():
            raise serializers.ValidationError(
                'No puede crear dos contactos con el mismo email.'
            )
        return value
