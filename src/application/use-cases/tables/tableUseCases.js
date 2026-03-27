// Use Cases Table
export class CreateTable {
  constructor(tableRepository, restaurantRepository) {
    this.tableRepository = tableRepository;
    this.restaurantRepository = restaurantRepository;
  }
  async execute(data) {
    const restaurant = await this.restaurantRepository.findById(data.restaurant);
    if (!restaurant) throw new Error('Restaurant introuvable');
    return await this.tableRepository.save(data);
  }
}

export class GetAllTables {
  constructor(tableRepository) { this.tableRepository = tableRepository; }
  async execute({ page, limit, restaurantId } = {}) {
    return await this.tableRepository.findAll({ page, limit, restaurantId });
  }
}

export class GetAvailableTables {
  constructor(tableRepository) { this.tableRepository = tableRepository; }
  async execute({ date, startTime, endTime, capacity, restaurantId } = {}) {
    if (!date || !startTime || !endTime) {
      throw new Error('date, startTime et endTime sont requis');
    }
    return await this.tableRepository.findAvailable({ date, startTime, endTime, capacity, restaurantId });
  }
}

export class UpdateTable {
  constructor(tableRepository) { this.tableRepository = tableRepository; }
  async execute(id, data) {
    const table = await this.tableRepository.update(id, data);
    if (!table) throw new Error('Table introuvable');
    return table;
  }
}

export class DeleteTable {
  constructor(tableRepository) { this.tableRepository = tableRepository; }
  async execute(id) {
    const table = await this.tableRepository.delete(id);
    if (!table) throw new Error('Table introuvable');
    return { message: 'Table désactivée avec succès' };
  }
}
