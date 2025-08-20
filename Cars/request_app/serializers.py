from rest_framework import serializers
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



class CCBRequestSubSectionJoinSerializer(serializers.ModelSerializer):
    sub_section_name = serializers.CharField(source="sub_section.sub_section_name")

    class Meta:
        model = CCBRequestSubSectionJoin
        fields = ["row_id", "sub_section_name", "content", "is_active"]


class CCBRequestSectionJoinSerializer(serializers.ModelSerializer):
    section_name = serializers.CharField(source="section.section_name")
    subsections = serializers.SerializerMethodField()

    class Meta:
        model = CCBRequestSectionJoin
        fields = ["row_id", "section_name", "is_active", "subsections"]

    def get_subsections(self, obj):
        subsections = CCBRequestSubSectionJoin.objects.filter(
            request=obj.request, section=obj.section
        )
        return CCBRequestSubSectionJoinSerializer(subsections, many=True).data


class CCBRequestsSerializer(serializers.ModelSerializer):
    change_status = serializers.SerializerMethodField()
    it_vertical = serializers.SerializerMethodField()
    sbu = serializers.SerializerMethodField()
    scope_of_change = serializers.SerializerMethodField()
    change_class = serializers.SerializerMethodField()
    submitted_by = serializers.SerializerMethodField()
    approved_by = serializers.SerializerMethodField()
    proposal_assessed_by = serializers.SerializerMethodField()
    proposal_recommend = serializers.SerializerMethodField()
    arch_assessed_by = serializers.SerializerMethodField()
    arch_recommend = serializers.SerializerMethodField()
    cio_decision = serializers.SerializerMethodField()
    cio_priority = serializers.SerializerMethodField()

    sections = CCBRequestSectionJoinSerializer(many=True, read_only=True)

    class Meta:
        model = CCBRequests
        fields = "__all__"

    def get_change_status(self, obj):
        return obj.change_status.status if obj.change_status else None

    def get_it_vertical(self, obj):
        return obj.it_vertical.it_vertical if obj.it_vertical else None

    def get_sbu(self, obj):
        return obj.sbu.business_unit if obj.sbu else None

    def get_scope_of_change(self, obj):
        return obj.scope_of_change.change_scope if obj.scope_of_change else None

    def get_change_class(self, obj):
        return obj.change_class.classification if obj.change_class else None

    def get_submitted_by(self, obj):
        return obj.submitted_by.user_name if obj.submitted_by else None

    def get_approved_by(self, obj):
        return (
            obj.approved_by.vertical_lead.user_name
            if (obj.approved_by and obj.approved_by.vertical_lead)
            else None
        )

    def get_proposal_assessed_by(self, obj):
        return obj.proposal_assessed_by.user_name if obj.proposal_assessed_by else None

    def get_proposal_recommend(self, obj):
        return obj.proposal_recommend.decision if obj.proposal_recommend else None

    def get_arch_assessed_by(self, obj):
        return obj.arch_assessed_by.user_name if obj.arch_assessed_by else None

    def get_arch_recommend(self, obj):
        return obj.arch_recommend.decision if obj.arch_recommend else None

    def get_cio_decision(self, obj):
        return obj.cio_decision.decision if obj.cio_decision else None

    def get_cio_priority(self, obj):
        return obj.cio_priority.priority if obj.cio_priority else None


    def create(self, validated_data):
        # create the request record
        request_instance = CCBRequests.objects.create(**validated_data)

        # get all active sections
        sections = CCBSections.objects.filter(is_active=True).order_by("sequence")

        for section in sections:
            section_join = CCBRequestSectionJoin.objects.create(
                request=request_instance, section=section, is_active=True
            )

            # get all active subsections for this section
            subsections = CCBSubSections.objects.filter(section=section, is_active=True).order_by("sequence")

            for subsection in subsections:
                CCBRequestSubSectionJoin.objects.create(
                    request=request_instance,
                    section=section,
                    sub_section=subsection,
                    is_active=True,
                    content=""  # default empty content
                )

        return request_instance


class ITVerticalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ITVerticals
        fields = "__all__"


class SBUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SBUs
        fields = "__all__"


class CCBScopesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCBScopes
        fields = "__all__"


class CCBClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCBClassification
        fields = "__all__"


class CCBUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCBUsers
        fields = "__all__"


class CCBDecisionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCBDecisions
        fields = "__all__"


class CCBPrioritiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCBPriorities
        fields = "__all__"


class CCBStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCBStatus
        fields = "__all__"

