from django.http import JsonResponse
from django.views.generic import View

from rest_framework import viewsets

from .models import Contact
from .serializers import ContactSerializer


class ContactViewSet(viewsets.ModelViewSet):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ContactsByTags(View):
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        tags = (request.POST.get('tags', '') or '').split(',')
        contacts = Contact.objects.find_by_any(tags)
        return JsonResponse({'contacts': [
            {'email': c.email, 'label': c.email} for c in contacts
        ]})
