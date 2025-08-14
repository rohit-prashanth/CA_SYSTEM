// sections.data.ts

export interface Subsection {
  id: number;
  name: string;
  active?: boolean;
}

export interface Section {
  id: number;
  name: string;
  expanded?: boolean;
  active?: boolean;
  children: Subsection[];
}

export interface RequestItem {
  id: number;
  name: string;
  expanded?: boolean;
  active?: boolean;
  sections: Section[];
  status: 'pending' | 'in_progress' | 'approved' | 'cancelled';
}

export const staticSections: Section[] = [
  {
    id: 1,
    name: 'Change Proposal',
    expanded: false,
    children: [
      { id: 1, name: 'Strategic/Operational Justification', active: false },
      { id: 2, name: 'Business Requirement /Drivers', active: false },
      { id: 3, name: 'Expected Benefits', active: false },
      { id: 4, name: 'High-Level Scope', active: false },
      { id: 5, name: 'High-Level Architecture', active: false },
      { id: 16, name: 'Detail the Technical Stack', active: false },
      { id: 17, name: 'Dependence on Other IT Verticals', active: false },
      { id: 18, name: 'Infrastructure Requirement', active: false },
      { id: 19, name: 'Proposed Vendor /OEM', active: false },
      { id: 110, name: 'Timeline Estimate', active: false },
    ],
  },
  {
    id: 2,
    name: 'Impact Assessment',
    expanded: false,
    children: [
      { id: 21, name: 'Business Process Assessment', active: false },
      { id: 22, name: 'Technology Assessment', active: false },
      { id: 23, name: 'Operational Assessment', active: false },
      { id: 24, name: 'Data Integration Assessment', active: false },
      { id: 25, name: 'Access and Data Security Assessment', active: false },
      { id: 26, name: 'Risk and Compliance Considerations', active: false },
      { id: 27, name: 'Dependencies Identified', active: false },
      { id: 28, name: 'Gaps Identified', active: false },
      { id: 29, name: 'Additional Changes Identified', active: false },
      { id: 210, name: 'Assessment Conclusion', active: false },
    ],
  },
  {
    id: 3,
    name: 'Formal Approval Record',
    expanded: false,
    children: [
      { id: 31, name: 'Decision Remarks', active: false },
      { id: 32, name: 'Budget/Funding Remarks', active: false },
      { id: 33, name: 'Conditions /Dependencies', active: false },
    ],
  },
  {
    id: 4,
    name: 'Integrated Change Plan',
    expanded: false,
    children: [
      { id: 41, name: 'Plan Date', active: false },
      { id: 42, name: 'Solution Design Summary', active: false },
      { id: 43, name: 'Revised Architecture', active: false },
      { id: 44, name: 'Concluded Infrastructure', active: false },
      { id: 45, name: 'Milestones & Deliverables', active: false },
      { id: 46, name: 'Resource and Timeline Plan', active: false },
      { id: 47, name: 'Risk Mitigation Plan', active: false },
      { id: 48, name: 'Change Readiness Plan', active: false },
    ],
  },
  {
    id: 5,
    name: 'Architecture Review',
    expanded: false,
    children: [
      { id: 51, name: 'Solution Overview', active: false },
      { id: 52, name: 'Alignment with IT Landscape', active: false },
      { id: 53, name: 'Inter-System Integrations', active: false },
      { id: 54, name: 'Compliance with Standards', active: false },
      { id: 55, name: 'Scalability for 5 years', active: false },
      { id: 56, name: 'Security Implications', active: false },
      { id: 57, name: 'Feedback', active: false },
    ],
  },
  {
    id: 6,
    name: 'Progress and Risk Reports',
    expanded: false,
    children: [
      { id: 61, name: 'Report Period', active: false },
      { id: 62, name: 'Report Date', active: false },
      { id: 63, name: 'Project Status', active: false }, // "On Track, Behind Schedule, At Risk"
      { id: 64, name: 'Progress Summary', active: false },
      { id: 65, name: 'Risks Identified & Mitigations Taken', active: false },
      { id: 66, name: 'Escalations', active: false },
      { id: 67, name: 'Next Steps', active: false },
    ],
  },
  {
    id: 7,
    name: 'Post-Implementation Review',
    expanded: false,
    children: [
      { id: 71, name: 'Planned vs. Actual Outcomes', active: false },
      { id: 72, name: 'Business Feedback', active: false },
      { id: 73, name: 'Project Takeaways', active: false },
      { id: 74, name: 'New areas identified for change', active: false },
      { id: 75, name: 'Closure Approval', active: false },
    ],
  },
];
