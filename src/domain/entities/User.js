export class User {
  constructor({ name, email, password, role = 'CLIENT' }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date();
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }
}
