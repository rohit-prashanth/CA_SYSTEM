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
