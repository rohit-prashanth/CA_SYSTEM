import os
from rest_framework import viewsets
from .models import (
    CCBRequests,
    ITVerticals,
    SBUs,
    CCBScopes,
    CCBClassification,
    CCBUsers,
    CCBDecisions,
    CCBPriorities,
    CCBStatus,
    CCBSections,
    CCBRoles,
    CCBSubSections,
    CCBRequestSectionJoin,
    CCBRequestSubSectionJoin,
    CCBRoleUserJoin,
    ChangeLog,
)


from .serializers import (
    CCBRequestsSerializer,
    ITVerticalsSerializer,
    SBUsSerializer,
    CCBScopesSerializer,
    CCBClassificationSerializer,
    CCBUsersSerializer,
    CCBDecisionsSerializer,
    CCBPrioritiesSerializer,
    CCBStatusSerializer,
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
from rest_framework.decorators import action


class CCBRequestsViewSet(viewsets.ModelViewSet):
    queryset = CCBRequests.objects.all()
    serializer_class = CCBRequestsSerializer


class ITVerticalsViewSet(viewsets.ModelViewSet):
    queryset = ITVerticals.objects.all()
    serializer_class = ITVerticalsSerializer


class SBUsViewSet(viewsets.ModelViewSet):
    queryset = SBUs.objects.all()
    serializer_class = SBUsSerializer


class CCBScopesViewSet(viewsets.ModelViewSet):
    queryset = CCBScopes.objects.all()
    serializer_class = CCBScopesSerializer


class CCBClassificationViewSet(viewsets.ModelViewSet):
    queryset = CCBClassification.objects.all()
    serializer_class = CCBClassificationSerializer


class CCBUsersViewSet(viewsets.ModelViewSet):
    queryset = CCBUsers.objects.all()
    serializer_class = CCBUsersSerializer


class CCBDecisionsViewSet(viewsets.ModelViewSet):
    queryset = CCBDecisions.objects.all()
    serializer_class = CCBDecisionsSerializer


class CCBPrioritiesViewSet(viewsets.ModelViewSet):
    queryset = CCBPriorities.objects.all()
    serializer_class = CCBPrioritiesSerializer


class CCBStatusViewSet(viewsets.ModelViewSet):
    queryset = CCBStatus.objects.all()
    serializer_class = CCBStatusSerializer



class UploadDocView(APIView):
    @staticmethod
    def upload_file_to_onedrive(local_filepath, remote_filename):
        access_token = 'YOUR_MICROSOFT_GRAPH_ACCESS_TOKEN'
        url = f'https://graph.microsoft.com/v1.0/me/drive/root:/{remote_filename}:/content'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/octet-stream'
        }
        with open(local_filepath, 'rb') as f:
            data = f.read()
        response = requests.put(url, headers=headers, data=data)
        if response.status_code in (200,201):
            return True, "Success"
        else:
            return False, response.text

    def post(self, request, format=None):
        try:
            file = request.FILES.get('file')
            if not file:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

            path = os.path.join(settings.MEDIA_ROOT,'documents')
            file_name = 'temp.docx'
            file_path = os.path.join(path,file_name)
            
            # (1) Save file locally or handle it directly
            with open(file_path, 'wb+') as f:
                for chunk in file.chunks():
                    f.write(chunk)

            # (2) Upload to OneDrive
            # success, message = UploadDocView.upload_file_to_onedrive('temp.docx', file.name)
            # if success:
            #     return Response({'message': 'Uploaded successfully'}, status=status.HTTP_200_OK)
            # else:
            #     return Response({'error': message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"message": "success"}, )
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)