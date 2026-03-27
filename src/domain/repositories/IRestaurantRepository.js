/**
 * Port (interface) pour le repository Restaurant
 */
export class IRestaurantRepository {
  async save(restaurant) { throw new Error('Not implemented'); }
  async findAll({ page, limit, search }) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}
