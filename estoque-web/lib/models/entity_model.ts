export interface Entity {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  enterprise_id: string;
  safe_delete?: boolean;
  created_at?: string;
}