export class Entity {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  enterprise_id?: string;
  safe_delete?: boolean;
  created_at?: string;

  constructor(name: string, email: string, phone: string, address: string, description?: string, enterprise_id?: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.description = description;
    this.enterprise_id = enterprise_id;
    this.safe_delete = false;
    this.created_at = new Date().toISOString();
    }
}