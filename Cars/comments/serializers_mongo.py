# serializers_mongo.py

from rest_framework import serializers
from .mongo_models import CCBComments, CCBAttachments, Comment
import datetime as dt


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class CommentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    post_id = serializers.CharField()
    user_id = serializers.CharField()
    text = serializers.CharField()
    parent = serializers.CharField(allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    replies = RecursiveField(many=True, read_only=True)

    likes = serializers.ListField(child=serializers.CharField(), read_only=True)
    dislikes = serializers.ListField(child=serializers.CharField(), read_only=True)

    # def create(self, validated_data):
    #     comment = Comment(**validated_data)
    #     comment.save()
    #     return comment

    def create(self, validated_data):
        parent_id = validated_data.pop('parent', None)
        if parent_id:
            parent = Comment.objects.get(id=parent_id)
            validated_data['parent'] = parent
        comment = Comment(**validated_data)
        comment.save()
        return comment

    def update(self, instance, validated_data):
        instance.text = validated_data.get('text', instance.text)
        instance.updated_at = dt.datetime.now(dt.timezone.utc)
        instance.save()
        return instance


class CCBCommentsSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    req_sec_sub_section_id = serializers.IntegerField()
    sequence = serializers.IntegerField()
    comment = serializers.CharField(allow_blank=True)
    comment_on = serializers.DateTimeField()
    comment_by = serializers.IntegerField()

    def create(self, validated_data):
        return CCBComments.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class AttachmentSerializer(serializers.Serializer):
    file = serializers.FileField()
    file_name = serializers.CharField(max_length=255)
    

class CCBAttachmentsSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    req_sec_sub_section_id = serializers.IntegerField()
    sequence = serializers.IntegerField()
    attachment_name = serializers.CharField()
    attachment_link = serializers.CharField()
    attached_by = serializers.IntegerField()

    def create(self, validated_data):
        return CCBAttachments.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
