export class Table {
  constructor({ restaurantId, capacity, number, description = '' }) {
    this.restaurantId = restaurantId;
    this.capacity = capacity;
    this.number = number;
    this.description = description;
    this.isActive = true;
  }
}
