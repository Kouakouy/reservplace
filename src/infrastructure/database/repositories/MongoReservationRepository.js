import { IReservationRepository } from '../../../domain/repositories/IReservationRepository.js';
import ReservationModel from '../models/ReservationModel.js';

export class MongoReservationRepository extends IReservationRepository {
  async save(data) {
    const reservation = await ReservationModel.create(data);
    return reservation.populate([
      { path: 'user', select: 'name email' },
      { path: 'table', populate: { path: 'restaurant', select: 'name address' } },
    ]);
  }

  async findConflicts(tableId, date, startTime, endTime) {
    return await ReservationModel.find({
      table: tableId,
      date: new Date(date),
      status: 'ACTIVE',
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });
  }

  async findAll({ page = 1, limit = 10, userId, restaurantId, date, status } = {}) {
    const skip = (page - 1) * limit;
    const query = {};
    if (userId) query.user = userId;
    if (status) query.status = status;
    if (date) query.date = new Date(date);

    let reservations = ReservationModel.find(query)
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'table', populate: { path: 'restaurant', select: 'name address' } })
      .sort({ date: -1, startTime: 1 });

    // Filtrage par restaurant (via table)
    if (restaurantId) {
      const all = await reservations;
      const filtered = all.filter(
        (r) => r.table?.restaurant?._id?.toString() === restaurantId
      );
      const total = filtered.length;
      const data = filtered.slice(skip, skip + limit);
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    const [data, total] = await Promise.all([
      reservations.skip(skip).limit(limit),
      ReservationModel.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await ReservationModel.findById(id)
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'table', populate: { path: 'restaurant', select: 'name address' } });
  }

  async update(id, data) {
    return await ReservationModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'table', populate: { path: 'restaurant', select: 'name address' } });
  }

  async findHistory({ userId, page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const query = { user: userId };

    const [data, total] = await Promise.all([
      ReservationModel.find(query)
        .populate({ path: 'user', select: 'name email' })
        .populate({ path: 'table', populate: { path: 'restaurant', select: 'name address' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ReservationModel.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
