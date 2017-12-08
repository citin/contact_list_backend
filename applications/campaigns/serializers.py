from rest_framework import serializers

from applications.campaigns.models import Campaign


class CampaignSerializer(serializers.HyperlinkedModelSerializer):

    emails = serializers.SerializerMethodField()

    def get_emails(self, campaign):
        return [{'email': c.email, 'label': c.email} for c in campaign.contacts.all()]


    class Meta:
        model = Campaign
        fields = ('id', 'title', 'body', 'email', 'subject', 'emails')
