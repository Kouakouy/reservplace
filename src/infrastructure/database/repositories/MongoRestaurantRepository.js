import { IRestaurantRepository } from '../../../domain/repositories/IRestaurantRepository.js';
import RestaurantModel from '../models/RestaurantModel.js';

export class MongoRestaurantRepository extends IRestaurantRepository {
  async save(data) {
    return await RestaurantModel.create(data);
  }

  async findAll({ page = 1, limit = 10, search = '' } = {}) {
    const skip = (page - 1) * limit;
    const query = search
      ? { $text: { $search: search } }
      : {};

    const [data, total] = await Promise.all([
      RestaurantModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      RestaurantModel.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await RestaurantModel.findById(id);
  }

  async update(id, data) {
    return await RestaurantModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await RestaurantModel.findByIdAndDelete(id);
  }
}
