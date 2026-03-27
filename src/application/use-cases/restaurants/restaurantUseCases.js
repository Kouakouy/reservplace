// Use Cases Restaurant - regroupés pour simplifier
export class CreateRestaurant {
  constructor(restaurantRepository) { this.restaurantRepository = restaurantRepository; }
  async execute(data) { return await this.restaurantRepository.save(data); }
}

export class GetAllRestaurants {
  constructor(restaurantRepository) { this.restaurantRepository = restaurantRepository; }
  async execute({ page, limit, search } = {}) {
    return await this.restaurantRepository.findAll({ page, limit, search });
  }
}

export class GetRestaurantById {
  constructor(restaurantRepository) { this.restaurantRepository = restaurantRepository; }
  async execute(id) {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) throw new Error('Restaurant introuvable');
    return restaurant;
  }
}

export class UpdateRestaurant {
  constructor(restaurantRepository) { this.restaurantRepository = restaurantRepository; }
  async execute(id, data) {
    const restaurant = await this.restaurantRepository.update(id, data);
    if (!restaurant) throw new Error('Restaurant introuvable');
    return restaurant;
  }
}

export class DeleteRestaurant {
  constructor(restaurantRepository) { this.restaurantRepository = restaurantRepository; }
  async execute(id) {
    const restaurant = await this.restaurantRepository.delete(id);
    if (!restaurant) throw new Error('Restaurant introuvable');
    return { message: 'Restaurant supprimé avec succès' };
  }
}
