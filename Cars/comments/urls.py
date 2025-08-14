from django.urls import path
from .views import (
    CCBCommentsView, CCBCommentDetailView,
    CCBAttachmentsView, CCBAttachmentDetailView
)

urlpatterns = [
    path('', CCBCommentsView.as_view()),
    path('<str:pk>/', CCBCommentDetailView.as_view()),

    path('attachments/', CCBAttachmentsView.as_view()),
    path('attachments/<str:pk>/', CCBAttachmentDetailView.as_view()),
]



"""
GET    /mongo/comments/
POST   /mongo/comments/
GET    /mongo/comments/<id>/
PUT    /mongo/comments/<id>/
DELETE /mongo/comments/<id>/
"""