from django.db import transaction
from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

class ReportViewSet(viewsets.GenericViewSet):
    # POST /report/
    @transaction.atomic
    def create(self, request):
        return Response("create report", status=status.HTTP_201_CREATED)

    # GET /report/
    def list(self, request):
        return Response("get report", status=status.HTTP_200_OK)