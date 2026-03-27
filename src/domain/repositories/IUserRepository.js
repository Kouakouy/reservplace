/**
 * Port (interface) pour le repository User
 * Toute implémentation doit respecter ce contrat
 */
export class IUserRepository {
  async create(user) { throw new Error('Not implemented'); }
  async update(id, user) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }

  // Authentification OTP
  async saveAdminCode(id, code, expiresAt) { throw new Error('Not implemented'); }
  async verifyAdminCode(id, code) { throw new Error('Not implemented'); }
}
