import os
import uuid
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from request_app.models import CCBUsers

from .mongo_models import Attachment, CCBComments, CCBAttachments, Comment
from .serializers_mongo import (
    AttachmentSerializer,
    CCBCommentsSerializer,
    CCBAttachmentsSerializer,
    CommentSerializer,
)


Attachment_DIR = os.path.join(settings.MEDIA_ROOT, "attachments")
Attachment_URL = os.path.join(settings.MEDIA_URL, "attachments")
os.makedirs(Attachment_DIR, exist_ok=True)



class CommentListCreateAPIView(APIView):

    def get(self, request, post_id):
        comments = Comment.objects(post_id=post_id, parent=None)

        # 1. Gather all user_ids (including nested replies)
        def collect_user_ids(comments):
            ids = set()
            for c in comments:
                ids.add(c.user_id)
                replies = Comment.objects(parent=c.id)
                ids.update(collect_user_ids(replies))
            return ids

        user_ids = collect_user_ids(comments)

        # 2. Fetch all users in one query
        users = CCBUsers.objects.filter(row_id__in=list(user_ids)).only("row_id", "user_name")
        user_map = {u.row_id: u.user_name for u in users}


        # 3. Build tree with usernames injected
        def build_comment_tree(comment):
            data = {
                "id": str(comment.id),
                "post_id": comment.post_id,
                "user_id": comment.user_id,
                "user_name": user_map.get(comment.user_id, "Unknown User"),
                "text": comment.text,
                "created_at": comment.created_at,
                "likes": getattr(comment, "likes", []),
                "dislikes": getattr(comment, "dislikes", []),
                "replies": [],
            }
            replies = Comment.objects(parent=comment.id)
            data["replies"] = [build_comment_tree(r) for r in replies]
            return data

        data = [build_comment_tree(c) for c in comments]
        return Response(data)

    def post(self, request, post_id):
        data = request.data.copy()
        data["post_id"] = post_id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentLikeDislikeAPIView(APIView):
    """Handles like and dislike actions for comments"""

    def post(self, request, comment_id, action):
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response(
                {"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        user_id = request.data.get("user_id")
        if not user_id:
            return Response(
                {"error": "user_id required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if action == "like":
            if user_id in comment.dislikes:
                comment.dislikes.remove(user_id)
            if user_id in comment.likes:
                comment.likes.remove(user_id)  # toggle off
            else:
                comment.likes.append(user_id)

        elif action == "dislike":
            if user_id in comment.likes:
                comment.likes.remove(user_id)
            if user_id in comment.dislikes:
                comment.dislikes.remove(user_id)  # toggle off
            else:
                comment.dislikes.append(user_id)
        else:
            return Response(
                {"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST
            )

        comment.save()
        return Response(CommentSerializer(comment).data, status=status.HTTP_200_OK)


class CommentDetailAPIView(APIView):
    def put(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class AttachmentUploadView(APIView):
     def post(self, request):
        serializer = AttachmentSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']
            display_name = serializer.validated_data['file_name']

            # Create safe file name: uuid + original extension
            ext = os.path.splitext(file.name)[1]  # e.g. ".pdf"
            safe_name = f"{uuid.uuid4().hex}{ext}"

            save_path = os.path.join(Attachment_DIR, safe_name)
            with open(save_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            file_url = f"{Attachment_URL}/{safe_name}"

            # Save record in MongoDB
            attachment = Attachment(
                file_name=display_name,   # user-chosen name
                file_path=file_url,  # URL path
                file_type=file.content_type
            )
            attachment.save()

            return Response({
                "message": "File uploaded successfully",
                "id": str(attachment.id),
                "file_name": display_name,
                "file_path": attachment.file_path
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AttachmentListView(APIView):
    def get(self, request):
        attachments = Attachment.objects()
        data = []
        for a in attachments:
            data.append(
                {
                    "id": str(a.id),
                    "file_name": a.file_name,
                    "file_path": a.file_path,
                    "file_type": a.file_type,
                }
            )
        return Response(data, status=status.HTTP_200_OK)
