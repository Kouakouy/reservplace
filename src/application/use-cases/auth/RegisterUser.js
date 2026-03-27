// Use Case : Inscription d'un utilisateur
export class RegisterUser {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute({ name, email, password, role = 'CLIENT' }) {
    // Vérifier si l'email est déjà utilisé
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    const user = await this.userRepository.save({ name, email, password, role });
    const token = this.jwtService.sign({ id: user._id, role: user.role });

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }
}
