from django.db import models
from django.utils import timezone


class CCBRequests(models.Model):
    row_id = models.AutoField(primary_key=True)
    change_title = models.CharField(max_length=50)
    executive_sponsor = models.CharField(max_length=50)
    proposal_date = models.DateField(default=timezone.now)
    it_vertical = models.ForeignKey(
        "ITVerticals", on_delete=models.SET_NULL, null=True, db_column="ITVertical"
    )
    sbu = models.ForeignKey(
        "SBUs", on_delete=models.SET_NULL, null=True, db_column="SBU"
    )
    scope_of_change = models.ForeignKey(
        "CCBScopes", on_delete=models.SET_NULL, null=True, db_column="ScopeOfChange"
    )
    change_class = models.ForeignKey(
        "CCBClassification",
        on_delete=models.SET_NULL,
        null=True,
        db_column="ChangeClass",
    )
    budgeted = models.BooleanField(default=False)
    budget_value = models.FloatField(default=0)
    submitted_by = models.ForeignKey(
        "CCBUsers",
        on_delete=models.SET_NULL,
        null=True,
        related_name="submitted_requests",
        db_column="SubmittedBy",
    )
    approved_by = models.ForeignKey(
        "ITVerticals",
        on_delete=models.SET_NULL,
        null=True,
        related_name="approved_requests",
        db_column="ApprovedBy",
    )
    project_manager = models.CharField(max_length=50, null=True)
    plan_go_live_date = models.DateField(null=True, blank=True)
    actual_go_live_date = models.DateField(null=True, blank=True)
    proposal_assessed_date = models.DateField(null=True, blank=True)
    proposal_assessed_by = models.ForeignKey(
        "CCBUsers",
        on_delete=models.SET_NULL,
        null=True,
        related_name="assessed_proposals",
        db_column="ProposalAssessedBy",
    )
    proposal_recommend = models.ForeignKey(
        "CCBDecisions",
        on_delete=models.SET_NULL,
        null=True,
        db_column="ProposalRecommend",
    )
    arch_assessed_date = models.DateField(null=True, blank=True)
    arch_assessed_by = models.ForeignKey(
        "CCBUsers",
        on_delete=models.SET_NULL,
        null=True,
        related_name="assessed_arch",
        db_column="ArchAssessedBy",
    )
    arch_recommend = models.ForeignKey(
        "CCBDecisions",
        on_delete=models.SET_NULL,
        null=True,
        related_name="arch_recommend",
        db_column="ArchRecommend",
    )
    cio_decision = models.ForeignKey(
        "CCBDecisions",
        on_delete=models.SET_NULL,
        null=True,
        related_name="cio_decisions",
        db_column="CIODecision",
    )
    cio_decision_date = models.DateField(null=True, blank=True)
    cio_priority = models.ForeignKey(
        "CCBPriorities", on_delete=models.SET_NULL, null=True, db_column="CIOPriority"
    )
    change_status = models.ForeignKey(
        "CCBStatus", on_delete=models.SET_NULL, null=True, db_column="ChangeStatus"
    )
    closure_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "CCBRequests"


class ITVerticals(models.Model):
    row_id = models.AutoField(primary_key=True)
    it_vertical = models.CharField(max_length=50)
    vertical_lead = models.ForeignKey(
        "CCBUsers", on_delete=models.SET_NULL, null=True, db_column="VerticalLead"
    )
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "ITVerticals"

    def __str__(self):
        return self.it_vertical


class SBUs(models.Model):
    row_id = models.AutoField(primary_key=True)
    business_unit = models.CharField(max_length=50)
    bu_biz_head = models.CharField(max_length=50)
    bu_biz_head_email = models.CharField(max_length=50)
    bu_fin_head = models.CharField(max_length=50)
    bu_fin_head_email = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "SBUs"

    def __str__(self):
        return self.business_unit


class CCBScopes(models.Model):
    row_id = models.AutoField(primary_key=True)
    change_scope = models.CharField(max_length=30)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBScopes"

    def __str__(self):
        return self.change_scope


class CCBClassification(models.Model):
    row_id = models.AutoField(primary_key=True)
    classification = models.CharField(max_length=30)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBClassification"

    def __str__(self):
        return self.classification


class CCBUsers(models.Model):
    row_id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=50)
    ad_login = models.CharField(max_length=20, unique=True)
    email = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBUsers"

    def __str__(self):
        return self.user_name


class CCBDecisions(models.Model):
    row_id = models.AutoField(primary_key=True)
    decision = models.CharField(max_length=30)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBDecisions"

    def __str__(self):
        return self.decision


class CCBPriorities(models.Model):
    row_id = models.AutoField(primary_key=True)
    priority = models.CharField(max_length=30)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBPriorities"

    def __str__(self):
        return self.priority


class CCBStatus(models.Model):
    row_id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=30)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBStatus"

    def __str__(self):
        return self.status


class CCBSections(models.Model):
    row_id = models.AutoField(primary_key=True)
    sequence = models.SmallIntegerField(null=True, blank=True)
    section_name = models.CharField(max_length=50)
    section_role_update = models.ForeignKey(
        "CCBRoles", on_delete=models.SET_NULL, null=True, db_column="SectionRoleUpdate"
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "CCBSections"

    def __str__(self):
        return self.section_name


class CCBRoles(models.Model):
    row_id = models.AutoField(primary_key=True)
    role_description = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBRoles"

    def __str__(self):
        return self.role_description


class CCBSubSections(models.Model):
    row_id = models.AutoField(primary_key=True)
    section = models.ForeignKey(
        "CCBSections", on_delete=models.CASCADE, db_column="SectionID"
    )
    sequence = models.SmallIntegerField(null=True, blank=True)
    sub_section_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "CCBSubSections"
        unique_together = ("section", "sequence")

    def __str__(self):
        return self.sub_section_name


class CCBRequestSectionJoin(models.Model):
    row_id = models.AutoField(primary_key=True)
    request = models.ForeignKey(
        "CCBRequests", on_delete=models.CASCADE, db_column="RequestID"
    )
    section = models.ForeignKey(
        "CCBSections", on_delete=models.CASCADE, db_column="SectionID"
    )
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBRequestSectionJoin"
        unique_together = ("request", "section")

    def __str__(self):
        return f"Request {self.request_id} - Section {self.section_id}"


class CCBRequestSubSectionJoin(models.Model):
    row_id = models.AutoField(primary_key=True)
    request = models.ForeignKey(
        "CCBRequests", on_delete=models.CASCADE, db_column="RequestID"
    )
    section = models.ForeignKey(
        "CCBSections", on_delete=models.CASCADE, db_column="SectionID"
    )
    sub_section = models.ForeignKey(
        "CCBSubSections", on_delete=models.CASCADE, db_column="SubSectionID"
    )
    is_active = models.BooleanField(default=True)
    content = models.TextField(null=True, blank=True)  # nvarchar(max) → TextField

    class Meta:
        db_table = "CCBRequestSubSectionJoin"
        unique_together = ("request", "section", "sub_section")

    def __str__(self):
        return f"Request {self.request_id} - Section {self.section_id} - SubSection {self.sub_section_id}"


class CCBRoleUserJoin(models.Model):
    row_id = models.AutoField(primary_key=True)

    user = models.ForeignKey(
        "CCBUsers",
        on_delete=models.CASCADE,
        db_column="UserID",
        related_name="role_user_joins",
    )

    role = models.ForeignKey(
        "CCBRoles",
        on_delete=models.CASCADE,
        db_column="RoleID",
        related_name="role_user_joins",
    )

    access = models.CharField(
        max_length=1, null=True, blank=True
    )  # 'A' = Add, 'M' = Modify
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "CCBRoleUserJoin"
        managed = True

    def __str__(self):
        return f"{self.user} - {self.role} ({self.access})"



class ChangeLog(models.Model):
    change_date = models.DateField()
    change_time = models.TimeField(null=True, blank=True)

    table_name = models.CharField(max_length=20)
    change_action = models.CharField(max_length=1, null=True, blank=True)  # I = Insert, U = Update
    change_row_id = models.IntegerField()
    
    change_by = models.ForeignKey(
        'CCBUsers',
        on_delete=models.SET_NULL,
        null=True,
        db_column='ChangeBy',
        related_name='change_logs'
    )

    change_values = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'ChangeLog'
        unique_together = [('table_name', 'change_row_id')]  # Yes1 constraint
        indexes = [
            models.Index(fields=['change_date']),             # Yes2
            models.Index(fields=['change_by']),               # Yes3
        ]

    def __str__(self):
        return f"{self.table_name} - {self.change_action} on {self.change_date}"