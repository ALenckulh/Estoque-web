export class User {
    id?: number;
    name: string;
    email: string;
    password: string;
    admin: boolean;
    enterprise_id: number;

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.admin = false;
        this.enterprise_id = 0;
    }
}