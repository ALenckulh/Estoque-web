export class User {
  id: string;
  enterprise_id: number;
  is_admin: boolean;
  safe_delete: boolean;
  is_owner: boolean;
  name?: string;
  email?: string;

  constructor(
    id: string,
    enterprise_id: number,
    is_admin: boolean = false,
    safe_delete: boolean = false,
    is_owner: boolean = false,
    name?: string,
    email?: string
  ) {
    this.id = id;
    this.enterprise_id = enterprise_id;
    this.is_admin = is_admin;
    this.safe_delete = safe_delete;
    this.is_owner = is_owner;
    this.name = name;
    this.email = email;
  }
}
