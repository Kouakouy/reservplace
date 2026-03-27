export class Reservation {
  constructor({ userId, tableId, date, startTime, endTime, guestCount = 1, notes = '' }) {
    if (!userId) throw new Error('userId est requis');
    if (!tableId) throw new Error('tableId est requis');
    if (!date) throw new Error('date est requise');
    if (!startTime) throw new Error('startTime est requis');
    if (!endTime) throw new Error('endTime est requis');
    if (startTime >= endTime) throw new Error('startTime doit être avant endTime');

    this.userId = userId;
    this.tableId = tableId;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.guestCount = guestCount;
    this.notes = notes;
    this.status = 'ACTIVE';
    this.createdAt = new Date();
  }

  cancel() {
    if (this.status === 'CANCELLED') {
      throw new Error('Cette réservation est déjà annulée');
    }
    this.status = 'CANCELLED';
  }

  update({ date, startTime, endTime, guestCount, notes }) {
    if (this.status === 'CANCELLED') {
      throw new Error('Impossible de modifier une réservation annulée');
    }
    if (date) this.date = date;
    if (startTime) this.startTime = startTime;
    if (endTime) this.endTime = endTime;
    if (guestCount) this.guestCount = guestCount;
    if (notes !== undefined) this.notes = notes;
  }
}
