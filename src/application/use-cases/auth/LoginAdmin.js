export class LoginAdmin {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute({ email, code, password }) {
    if (!email || !code || !password) {
      throw new Error('Email, code OTP et nouveau mot de passe sont requis.');
    }

    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user || user.role !== 'ADMIN') {
      throw new Error("Administrateur introuvable.");
    }

    // 1. Vérifier le Code OTP (usage unique, s'efface après validation)
    const isCodeValid = await this.userRepository.verifyAdminCode(user._id, code);
    if (!isCodeValid) {
      throw new Error("Le code de vérification est invalide ou a expiré. Recommencez l'étape 1.");
    }

    // 2. Enregistrer le mot de passe final (remplace le mot de passe temporaire)
    user.password = password;
    await user.save(); // Le hook pre-save hache automatiquement le nouveau mot de passe

    // 3. Générer le JWT d'accès
    const token = this.jwtService.sign({ id: user._id, role: user.role });

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }
}
