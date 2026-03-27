import crypto from 'crypto';

export class RequestAdminCode {
  constructor(userRepository, mailService) {
    this.userRepository = userRepository;
    this.mailService = mailService;
  }

  async execute(email) {
    if (!email) throw new Error("L'email est requis.");

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      // L'admin n'existe pas encore : on crée le compte en attente de finalisation
      const tempPassword = crypto.randomBytes(16).toString('hex');
      user = await this.userRepository.save({
        name: 'Administrateur',
        email,
        password: tempPassword,
        role: 'ADMIN',
      });
    } else if (user.role !== 'ADMIN') {
      throw new Error("Un compte non-administrateur existe déjà avec cet email.");
    }

    // Génération PIN à 6 chiffres aléatoire
    const code = crypto.randomInt(100000, 999999).toString();

    // Expiration dans 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Sauvegarde en DB
    await this.userRepository.saveAdminCode(user._id, code, expiresAt);

    // Envoi par email
    await this.mailService.sendLoginCode(email, code);

    return {
      message: 'Un code de vérification a été envoyé à votre adresse email. Il expire dans 15 minutes.'
    };
  }
}

