# serializers_mongo.py

from rest_framework import serializers
from .mongo_models import CCBComments, CCBAttachments

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
