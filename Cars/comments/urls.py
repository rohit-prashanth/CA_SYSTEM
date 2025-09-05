from django.urls import path
from .views import (
    AttachmentListView,
    AttachmentUploadView,
    CommentListCreateAPIView,
    CommentDetailAPIView,
    CommentLikeDislikeAPIView,
)



urlpatterns = [
    # path("", CCBCommentsView.as_view()),
    # path("<str:pk>/", CCBCommentDetailView.as_view()),
    # path("attachments/", CCBAttachmentsView.as_view()),
    # path("attachments/<str:pk>/", CCBAttachmentDetailView.as_view()),
    path(
        "posts/<str:post_id>/comments/",
        CommentListCreateAPIView.as_view(),
        name="comments-list-create",
    ),
    path(
        "comments/<str:comment_id>/",
        CommentDetailAPIView.as_view(),
        name="comment-detail",
    ),
    # New like/dislike APIs
    path(
        "comments/<str:comment_id>/<str:action>/",
        CommentLikeDislikeAPIView.as_view(),
        name="comment-like-dislike",
    ),
    path("attachments/upload/", AttachmentUploadView.as_view(), name="attachment-upload"),
    path("attachments/<str:post_id>", AttachmentListView.as_view(), name="attachment-list")
]


"""
GET    /mongo/comments/
POST   /mongo/comments/
GET    /mongo/comments/<id>/
PUT    /mongo/comments/<id>/
DELETE /mongo/comments/<id>/
"""

