import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import UserModel from '../models/UserModel.js';

export class MongoUserRepository extends IUserRepository {
  async save(userData) {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email }).select('+password');
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }

  async saveAdminCode(id, code, expiresAt) {
    return UserModel.findByIdAndUpdate(id, {
      adminLoginCode: code,
      adminLoginCodeExpiresAt: expiresAt,
    }, { new: true });
  }

  async verifyAdminCode(id, code) {
    const user = await UserModel.findOne({
      _id: id,
      adminLoginCode: code,
      adminLoginCodeExpiresAt: { $gt: new Date() }, // Le code ne doit pas être expiré
    });
    
    // S'il est valide, on l'efface (usage unique)
    if (user) {
      user.adminLoginCode = null;
      user.adminLoginCodeExpiresAt = null;
      await user.save();
      return true;
    }
    return false;
  }

  async findById(id) {
    return await UserModel.findById(id);
  }
}
