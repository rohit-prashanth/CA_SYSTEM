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
      { id: 6, name: 'Detail the Technical Stack', active: false },
      { id: 7, name: 'Dependence on Other IT Verticals', active: false },
      { id: 8, name: 'Infrastructure Requirement', active: false },
      { id: 9, name: 'Proposed Vendor /OEM', active: false },
      { id: 10, name: 'Timeline Estimate', active: false },
    ],
  },
  {
    id: 2,
    name: 'Impact Assessment',
    expanded: false,
    children: [
      { id: 11, name: 'Business Process Assessment', active: false },
      { id: 12, name: 'Technology Assessment', active: false },
      { id: 13, name: 'Operational Assessment', active: false },
      { id: 14, name: 'Data Integration Assessment', active: false },
      { id: 15, name: 'Access and Data Security Assessment', active: false },
      { id: 16, name: 'Risk and Compliance Considerations', active: false },
      { id: 17, name: 'Dependencies Identified', active: false },
      { id: 18, name: 'Gaps Identified', active: false },
      { id: 19, name: 'Additional Changes Identified', active: false },
      { id: 20, name: 'Assessment Conclusion', active: false },
    ],
  },
  {
    id: 3,
    name: 'Formal Approval Record',
    expanded: false,
    children: [
      { id: 21, name: 'Decision Remarks', active: false },
      { id: 22, name: 'Budget/Funding Remarks', active: false },
      { id: 23, name: 'Conditions /Dependencies', active: false },
    ],
  },
  {
    id: 4,
    name: 'Integrated Change Plan',
    expanded: false,
    children: [
      { id: 24, name: 'Plan Date', active: false },
      { id: 25, name: 'Solution Design Summary', active: false },
      { id: 26, name: 'Revised Architecture', active: false },
      { id: 27, name: 'Concluded Infrastructure', active: false },
      { id: 28, name: 'Milestones & Deliverables', active: false },
      { id: 29, name: 'Resource and Timeline Plan', active: false },
      { id: 30, name: 'Risk Mitigation Plan', active: false },
      { id: 31, name: 'Change Readiness Plan', active: false },
    ],
  },
  {
    id: 5,
    name: 'Architecture Review',
    expanded: false,
    children: [
      { id: 32, name: 'Solution Overview', active: false },
      { id: 33, name: 'Alignment with IT Landscape', active: false },
      { id: 34, name: 'Inter-System Integrations', active: false },
      { id: 35, name: 'Compliance with Standards', active: false },
      { id: 36, name: 'Scalability for 5 years', active: false },
      { id: 37, name: 'Security Implications', active: false },
      { id: 38, name: 'Feedback', active: false },
    ],
  },
  {
    id: 6,
    name: 'Progress and Risk Reports',
    expanded: false,
    children: [
      { id: 39, name: 'Report Period', active: false },
      { id: 40, name: 'Report Date', active: false },
      { id: 41, name: 'Project Status', active: false }, // "On Track, Behind Schedule, At Risk"
      { id: 42, name: 'Progress Summary', active: false },
      { id: 43, name: 'Risks Identified & Mitigations Taken', active: false },
      { id: 44, name: 'Escalations', active: false },
      { id: 45, name: 'Next Steps', active: false },
    ],
  },
  {
    id: 7,
    name: 'Post-Implementation Review',
    expanded: false,
    children: [
      { id: 46, name: 'Planned vs. Actual Outcomes', active: false },
      { id: 47, name: 'Business Feedback', active: false },
      { id: 48, name: 'Project Takeaways', active: false },
      { id: 49, name: 'New areas identified for change', active: false },
      { id: 50, name: 'Closure Approval', active: false },
    ],
  },
];
