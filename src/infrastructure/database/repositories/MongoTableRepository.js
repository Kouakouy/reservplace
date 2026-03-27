import { ITableRepository } from '../../../domain/repositories/ITableRepository.js';
import TableModel from '../models/TableModel.js';
import ReservationModel from '../models/ReservationModel.js';

export class MongoTableRepository extends ITableRepository {
  async save(data) {
    return await TableModel.create(data);
  }

  async findAll({ page = 1, limit = 10, restaurantId } = {}) {
    const skip = (page - 1) * limit;
    const query = { isActive: true };
    if (restaurantId) query.restaurant = restaurantId;

    const [data, total] = await Promise.all([
      TableModel.find(query).populate('restaurant', 'name address').skip(skip).limit(limit),
      TableModel.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await TableModel.findById(id).populate('restaurant', 'name address');
  }

  async findAvailable({ date, startTime, endTime, capacity, restaurantId } = {}) {
    // Trouver les tables réservées sur ce créneau
    const conflictQuery = {
      date: new Date(date),
      status: 'ACTIVE',
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    };
    const reservedTableIds = (await ReservationModel.find(conflictQuery).select('table')).map(
      (r) => r.table
    );

    // Trouver les tables disponibles (non réservées)
    const tableQuery = { isActive: true, _id: { $nin: reservedTableIds } };
    if (capacity) tableQuery.capacity = { $gte: parseInt(capacity) };
    if (restaurantId) tableQuery.restaurant = restaurantId;

    return await TableModel.find(tableQuery).populate('restaurant', 'name address');
  }

  async update(id, data) {
    return await TableModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await TableModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}
