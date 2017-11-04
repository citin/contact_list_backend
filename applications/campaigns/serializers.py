from rest_framework import serializers

from applications.campaigns.models import Campaign


class CampaignSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Campaign
        fields = ('title', 'body', )
