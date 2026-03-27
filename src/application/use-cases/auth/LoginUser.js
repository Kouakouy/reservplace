// Use Case : Connexion d'un utilisateur
export class LoginUser {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = this.jwtService.sign({ id: user._id, role: user.role });

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }
}
