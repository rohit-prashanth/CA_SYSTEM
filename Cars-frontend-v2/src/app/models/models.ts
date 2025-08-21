export interface ITVertical {
  row_id: number;
  it_vertical: string;
  is_active: boolean;
  vertical_lead: number; // or another interface if you later expand vertical_lead to an object
}

export interface SBU {
  row_id: number;
  business_unit: string;
  bu_biz_head: string;
  bu_biz_head_email: string;
  bu_fin_head: string;
  bu_fin_head_email: string;
  is_active: boolean;
}

export interface CCBScope {
  row_id: number;
  change_scope: string;
  is_active: boolean;
}

export interface CCBClassification {
  row_id: number;
  classification: string;
  is_active: boolean;
}
