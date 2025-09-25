export class User {
  id?: number;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  enterprise_id: number;
  safe_delete: boolean;
  created_at: string;

  constructor(
    name: string,
    email: string,
    password: string,
    admin: boolean = false,
    enterprise_id: number = 0,
    safe_delete: boolean = false,
    created_at: string = new Date().toISOString(),
    id?: number
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.admin = admin;
    this.enterprise_id = enterprise_id;
    this.safe_delete = safe_delete;
    this.created_at = created_at;
    if (id !== undefined) this.id = id;
  }
}
