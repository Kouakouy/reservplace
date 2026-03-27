/**
 * Port (interface) pour le repository Reservation
 */
export class IReservationRepository {
  async save(reservation) { throw new Error('Not implemented'); }
  async findConflicts(tableId, date, startTime, endTime) { throw new Error('Not implemented'); }
  async findAll({ page, limit, userId, restaurantId, date, status }) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async findHistory({ userId, page, limit }) { throw new Error('Not implemented'); }
}
