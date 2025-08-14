from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .mongo_models import CCBComments, CCBAttachments
from .serializers_mongo import CCBCommentsSerializer, CCBAttachmentsSerializer


class CCBCommentsView(APIView):
    def get(self, request):
        comments = CCBComments.objects.all()
        serializer = CCBCommentsSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CCBCommentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CCBCommentDetailView(APIView):
    def get_object(self, pk):
        return CCBComments.objects.get(id=pk)

    def get(self, request, pk):
        comment = self.get_object(pk)
        serializer = CCBCommentsSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk):
        comment = self.get_object(pk)
        serializer = CCBCommentsSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = self.get_object(pk)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CCBAttachmentsView(APIView):
    def get(self, request):
        attachments = CCBAttachments.objects.all()
        serializer = CCBAttachmentsSerializer(attachments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CCBAttachmentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CCBAttachmentDetailView(APIView):
    def get_object(self, pk):
        return CCBAttachments.objects.get(id=pk)

    def get(self, request, pk):
        attachment = self.get_object(pk)
        serializer = CCBAttachmentsSerializer(attachment)
        return Response(serializer.data)

    def put(self, request, pk):
        attachment = self.get_object(pk)
        serializer = CCBAttachmentsSerializer(attachment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        attachment = self.get_object(pk)
        attachment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
