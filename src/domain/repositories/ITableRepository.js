/**
 * Port (interface) pour le repository Table
 */
export class ITableRepository {
  async save(table) { throw new Error('Not implemented'); }
  async findAll({ page, limit, restaurantId }) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findAvailable({ date, startTime, endTime, capacity, restaurantId }) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}
