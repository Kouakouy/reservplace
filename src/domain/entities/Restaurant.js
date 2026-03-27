export class Restaurant {
  constructor({ name, address, description = '', phone = '', openingHours = {} }) {
    this.name = name;
    this.address = address;
    this.description = description;
    this.phone = phone;
    this.openingHours = openingHours;
    this.createdAt = new Date();
  }
}
