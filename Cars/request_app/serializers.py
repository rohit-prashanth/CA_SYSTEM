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
    # accept IDs for FKs
    it_vertical = serializers.PrimaryKeyRelatedField(
        queryset=ITVerticals.objects.all(), required=False, allow_null=True
    )
    sbu = serializers.PrimaryKeyRelatedField(
        queryset=SBUs.objects.all(), required=False, allow_null=True
    )
    scope_of_change = serializers.PrimaryKeyRelatedField(
        queryset=CCBScopes.objects.all(), required=False, allow_null=True
    )
    change_class = serializers.PrimaryKeyRelatedField(
        queryset=CCBClassification.objects.all(), required=False, allow_null=True
    )
    submitted_by = serializers.PrimaryKeyRelatedField(
        queryset=CCBUsers.objects.all(), required=False, allow_null=True
    )
    approved_by = serializers.PrimaryKeyRelatedField(
        queryset=ITVerticals.objects.all(), required=False, allow_null=True
    )
    proposal_assessed_by = serializers.PrimaryKeyRelatedField(
        queryset=CCBUsers.objects.all(), required=False, allow_null=True
    )
    proposal_recommend = serializers.PrimaryKeyRelatedField(
        queryset=CCBDecisions.objects.all(), required=False, allow_null=True
    )
    arch_assessed_by = serializers.PrimaryKeyRelatedField(
        queryset=CCBUsers.objects.all(), required=False, allow_null=True
    )
    arch_recommend = serializers.PrimaryKeyRelatedField(
        queryset=CCBDecisions.objects.all(), required=False, allow_null=True
    )
    cio_decision = serializers.PrimaryKeyRelatedField(
        queryset=CCBDecisions.objects.all(), required=False, allow_null=True
    )
    cio_priority = serializers.PrimaryKeyRelatedField(
        queryset=CCBPriorities.objects.all(), required=False, allow_null=True
    )
    change_status = serializers.PrimaryKeyRelatedField(
        queryset=CCBStatus.objects.all(), required=False, allow_null=True
    )

    sections = CCBRequestSectionJoinSerializer(many=True, read_only=True)

    class Meta:
        model = CCBRequests
        fields = "__all__"

    def to_representation(self, instance):
        """Convert FK IDs to human-readable names in response"""
        rep = super().to_representation(instance)

        rep["it_vertical"] = (
            instance.it_vertical.it_vertical if instance.it_vertical else None
        )
        rep["sbu"] = instance.sbu.business_unit if instance.sbu else None
        rep["scope_of_change"] = (
            instance.scope_of_change.change_scope if instance.scope_of_change else None
        )
        rep["change_class"] = (
            instance.change_class.classification if instance.change_class else None
        )
        rep["submitted_by"] = (
            instance.submitted_by.user_name if instance.submitted_by else None
        )
        rep["approved_by"] = (
            instance.approved_by.vertical_lead.user_name
            if (instance.approved_by and instance.approved_by.vertical_lead)
            else None
        )
        rep["proposal_assessed_by"] = (
            instance.proposal_assessed_by.user_name
            if instance.proposal_assessed_by
            else None
        )
        rep["proposal_recommend"] = (
            instance.proposal_recommend.decision
            if instance.proposal_recommend
            else None
        )
        rep["arch_assessed_by"] = (
            instance.arch_assessed_by.user_name if instance.arch_assessed_by else None
        )
        rep["arch_recommend"] = (
            instance.arch_recommend.decision if instance.arch_recommend else None
        )
        rep["cio_decision"] = (
            instance.cio_decision.decision if instance.cio_decision else None
        )
        rep["cio_priority"] = (
            instance.cio_priority.priority if instance.cio_priority else None
        )
        rep["change_status"] = (
            instance.change_status.status if instance.change_status else None
        )

        return rep

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
            subsections = CCBSubSections.objects.filter(
                section=section, is_active=True
            ).order_by("sequence")

            for subsection in subsections:
                CCBRequestSubSectionJoin.objects.create(
                    request=request_instance,
                    section=section,
                    sub_section=subsection,
                    is_active=True,
                    content="",  # default empty content
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
