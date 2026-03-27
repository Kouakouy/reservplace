import { Reservation } from '../../../domain/entities/Reservation.js';

// Use Case : Créer une réservation
export class CreateReservation {
  constructor(reservationRepository, tableRepository) {
    this.reservationRepository = reservationRepository;
    this.tableRepository = tableRepository;
  }

  async execute(data) {
    // Vérifier que la table existe
    const table = await this.tableRepository.findById(data.tableId);
    if (!table) throw new Error('Table introuvable');

    // Vérifier la capacité
    if (data.guestCount && data.guestCount > table.capacity) {
      throw new Error(`La table ne peut accueillir que ${table.capacity} personnes`);
    }

    // Vérifier les conflits de réservation
    const conflicts = await this.reservationRepository.findConflicts(
      data.tableId, data.date, data.startTime, data.endTime
    );
    if (conflicts.length > 0) {
      throw new Error('Cette table est déjà réservée sur ce créneau horaire');
    }

    // Créer l'entité domain (validation incluse)
    new Reservation(data);

    return await this.reservationRepository.save({
      user: data.userId,
      table: data.tableId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      guestCount: data.guestCount || 1,
      notes: data.notes || '',
    });
  }
}

// Use Case : Lister les réservations
export class GetAllReservations {
  constructor(reservationRepository) { this.reservationRepository = reservationRepository; }
  async execute(filters = {}) {
    return await this.reservationRepository.findAll(filters);
  }
}

// Use Case : Détail d'une réservation
export class GetReservationById {
  constructor(reservationRepository) { this.reservationRepository = reservationRepository; }
  async execute(id) {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) throw new Error('Réservation introuvable');
    return reservation;
  }
}

// Use Case : Modifier une réservation
export class UpdateReservation {
  constructor(reservationRepository, tableRepository) {
    this.reservationRepository = reservationRepository;
    this.tableRepository = tableRepository;
  }

  async execute(id, data, requestingUserId, requestingUserRole) {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) throw new Error('Réservation introuvable');

    // Vérifier l'autorisation (proprio ou admin)
    if (
      requestingUserRole !== 'ADMIN' &&
      reservation.user._id.toString() !== requestingUserId.toString()
    ) {
      throw new Error('Accès non autorisé');
    }

    if (reservation.status === 'CANCELLED') {
      throw new Error('Impossible de modifier une réservation annulée');
    }

    // Vérifier les conflits si les créneaux changent
    if (data.startTime || data.endTime || data.date) {
      const newDate = data.date || reservation.date;
      const newStart = data.startTime || reservation.startTime;
      const newEnd = data.endTime || reservation.endTime;
      const tableId = data.tableId || reservation.table._id;

      const conflicts = await this.reservationRepository.findConflicts(tableId, newDate, newStart, newEnd);
      const realConflicts = conflicts.filter((c) => c._id.toString() !== id);
      if (realConflicts.length > 0) {
        throw new Error('Ce créneau est déjà réservé');
      }
    }

    const updateData = {};
    if (data.date) updateData.date = data.date;
    if (data.startTime) updateData.startTime = data.startTime;
    if (data.endTime) updateData.endTime = data.endTime;
    if (data.guestCount) updateData.guestCount = data.guestCount;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.tableId) updateData.table = data.tableId;

    return await this.reservationRepository.update(id, updateData);
  }
}

// Use Case : Annuler une réservation
export class CancelReservation {
  constructor(reservationRepository) { this.reservationRepository = reservationRepository; }
  async execute(id, requestingUserId, requestingUserRole) {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) throw new Error('Réservation introuvable');

    if (
      requestingUserRole !== 'ADMIN' &&
      reservation.user._id.toString() !== requestingUserId.toString()
    ) {
      throw new Error('Accès non autorisé');
    }

    if (reservation.status === 'CANCELLED') {
      throw new Error('Cette réservation est déjà annulée');
    }

    return await this.reservationRepository.update(id, { status: 'CANCELLED' });
  }
}

// Use Case : Historique des réservations
export class GetReservationHistory {
  constructor(reservationRepository) { this.reservationRepository = reservationRepository; }
  async execute({ userId, page, limit }) {
    return await this.reservationRepository.findHistory({ userId, page, limit });
  }
}

// Use Case : Vérifier la disponibilité
export class CheckTableAvailability {
  constructor(reservationRepository, tableRepository) {
    this.reservationRepository = reservationRepository;
    this.tableRepository = tableRepository;
  }
  async execute({ tableId, date, startTime, endTime }) {
    const table = await this.tableRepository.findById(tableId);
    if (!table) throw new Error('Table introuvable');

    const conflicts = await this.reservationRepository.findConflicts(tableId, date, startTime, endTime);
    return {
      available: conflicts.length === 0,
      table,
      conflicts: conflicts.length,
    };
  }
}
