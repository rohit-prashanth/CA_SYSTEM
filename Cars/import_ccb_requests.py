import os
import django
import pandas as pd

from datetime import datetime

# Setup Django environment
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "Cars.settings"
)  # change Cars to your project name
django.setup()

from request_app.models import CCBRequests  # change app name if needed

# === CONFIG ===
EXCEL_FILE = "ccbrequests.xlsx"

# === LOAD DATA ===
df = pd.read_excel(EXCEL_FILE)

# strip spaces from headers
df.columns = df.columns.str.strip()

# List of columns that are dates in your model
date_columns = [
    "proposal_date",
    "plan_go_live_date",
    "actual_go_live_date",
    "proposal_assessed_date",
    "arch_assessed_date",
    "cio_decision_date",
    "closure_date",
]


def parse_date(value):
    if pd.isna(value):  # Empty cell → None
        return None
    if isinstance(value, datetime):  # Already a datetime object
        return value.date()
    try:
        # Handles strings like "8/8/2025" or "2025-08-08"
        return pd.to_datetime(value, errors="coerce").date()
    except Exception:
        return None


# Convert date columns to datetime.date (YYYY-MM-DD)
for col in date_columns:
    if col in df.columns:
        df[col] = pd.to_datetime(df[col], errors="coerce").dt.date  # NaT → None

for _, row in df.iterrows():
    try:
        record = CCBRequests.objects.create(
            # row_id=int(row["row_id"]),
            change_title=row["change_title"],
            executive_sponsor=row["executive_sponsor"],
            proposal_date=parse_date(row["proposal_date"]),
            budgeted=bool(row["budgeted"]),
            budget_value=row["budget_value"] or 0,
            plan_go_live_date=parse_date(row["plan_go_live_date"]),
            actual_go_live_date=parse_date(row["actual_go_live_date"]),
            proposal_assessed_date=parse_date(row["proposal_assessed_date"]),
            arch_assessed_date=parse_date(row["arch_assessed_date"]),
            cio_decision_date=parse_date(row["cio_decision_date"]),
            closure_date=parse_date(row["closure_date"]),
            # Foreign keys (if empty → None)
            arch_recommend_id=(
                row["ArchRecommend"] if pd.notna(row["ArchRecommend"]) else None
            ),
            change_class_id=(
                row["ChangeClass"] if pd.notna(row["ChangeClass"]) else None
            ),
            cio_decision_id=(
                row["CIODecision"] if pd.notna(row["CIODecision"]) else None
            ),
            cio_priority_id=(
                row["CIOPriority"] if pd.notna(row["CIOPriority"]) else None
            ),
            proposal_recommend_id=(
                row["ProposalRecommend"] if pd.notna(row["ProposalRecommend"]) else None
            ),
            scope_of_change_id=(
                row["ScopeOfChange"] if pd.notna(row["ScopeOfChange"]) else None
            ),
            change_status_id=(
                row["ChangeStatus"] if pd.notna(row["ChangeStatus"]) else None
            ),
            arch_assessed_by_id=(
                row["ArchAssessedBy"] if pd.notna(row["ArchAssessedBy"]) else None
            ),
            proposal_assessed_by_id=(
                row["ProposalAssessedBy"]
                if pd.notna(row["ProposalAssessedBy"])
                else None
            ),
            submitted_by_id=(
                row["SubmittedBy"] if pd.notna(row["SubmittedBy"]) else None
            ),
            approved_by_id=row["ApprovedBy"] if pd.notna(row["ApprovedBy"]) else None,
            it_vertical_id=row["ITVertical"] if pd.notna(row["ITVertical"]) else None,
            sbu_id=row["SBU"] if pd.notna(row["SBU"]) else None,
            project_manager=(
                row["project_manager"] if pd.notna(row["project_manager"]) else ""
            ),
        )
        print(f"✅ Inserted row_id={record.row_id}")
    except Exception as e:
        print(f"❌ Error inserting row_id={row.get('row_id', 'UNKNOWN')}: {e}")
