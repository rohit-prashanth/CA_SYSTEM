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
