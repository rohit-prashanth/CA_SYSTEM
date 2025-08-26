from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CCBRequestsViewSet,
    ITVerticalsViewSet,
    SBUsViewSet,
    CCBScopesViewSet,
    CCBClassificationViewSet,
    CCBUsersViewSet,
    CCBDecisionsViewSet,
    CCBPrioritiesViewSet,
    CCBStatusViewSet,
    UploadDocView,
    import_doc,
    export_doc
)


router = DefaultRouter()
router.register(r"ccb-requests", CCBRequestsViewSet, basename="ccb-requests")
router.register(r"it-verticals", ITVerticalsViewSet, basename="it-verticals")
router.register(r"sbus", SBUsViewSet, basename="sbus")
router.register(r"ccb-scopes", CCBScopesViewSet, basename="ccb-scopes")
router.register(r"ccb-classification", CCBClassificationViewSet, basename="ccb-classification")
router.register(r"ccb-users", CCBUsersViewSet, basename="ccb-users")
router.register(r"ccb-decisions", CCBDecisionsViewSet, basename="ccb-decisions")
router.register(r"ccb-priorities", CCBPrioritiesViewSet, basename="ccb-priorities")
router.register(r"ccb-status", CCBStatusViewSet, basename="ccb-status")
# router.register(r"ccb-upload-document", UploadDocView, basename="ccb-upload-document")

urlpatterns = [
    path("", include(router.urls)),
    path(r"ccb-docx/", UploadDocView.as_view(), name="ccb-docx"),
    path("import/<str:filename>/", import_doc, name="import_doc"),
    path("export/", export_doc, name="export_doc"),
]
    

"""
GET /api/requests/  List all CCB requests

POST /api/requests/  Create a new CCB request

GET /api/requests/<id>/  Retrieve a specific CCB request

PUT /api/requests/<id>/  Update a CCB request

DELETE /api/requests/<id>/  Delete a CCB request
"""
