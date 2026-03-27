import { RegisterUser } from '../../application/use-cases/auth/RegisterUser.js';
import { LoginUser } from '../../application/use-cases/auth/LoginUser.js';
import { RequestAdminCode } from '../../application/use-cases/auth/RequestAdminCode.js';
import { LoginAdmin } from '../../application/use-cases/auth/LoginAdmin.js';
import { MongoUserRepository } from '../../infrastructure/database/repositories/MongoUserRepository.js';
import { JwtService } from '../../infrastructure/auth/JwtService.js';
import { MailService } from '../../infrastructure/mail/MailService.js';

const userRepo = new MongoUserRepository();
const jwtService = new JwtService();
const mailService = new MailService();

const registerUseCase = new RegisterUser(userRepo, jwtService);
const loginUseCase = new LoginUser(userRepo, jwtService);
const requestCodeUseCase = new RequestAdminCode(userRepo, mailService);
const loginAdminUseCase = new LoginAdmin(userRepo, jwtService);

// --- USER (Client) ---

/**
 * @swagger
 * /api/auth/user/register:
 *   post:
 *     tags: [Auth (Client)]
 *     summary: Inscription d'un nouveau Client
 *     description: Permet à un visiteur de se créer un compte de type Client.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Compte client créé avec succès et token JWT généré
 *       400:
 *         description: Données invalides ou email déjà utilisé
 */
export const registerUser = async (req, res, next) => {
  try {
    // Forcer le rôle à CLIENT pour cette route
    req.body.role = 'CLIENT';
    const result = await registerUseCase.execute(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/auth/user/login:
 *   post:
 *     tags: [Auth (Client)]
 *     summary: Connexion Client
 *     description: Authentifie un client à l'aide de son email et mot de passe pour obtenir son Token d'accès. Si un administrateur tente de se connecter ici, l'accès lui sera refusé.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Connexion réussie, token JWT renvoyé
 *       400:
 *         description: Email ou mot de passe incorrect
 *       403:
 *         description: Ce portail de connexion est réservé aux clients
 */
export const loginUser = async (req, res, next) => {
  try {
    const result = await loginUseCase.execute(req.body);
    // Vérification de sécurité supplémentaire
    if (result.user.role !== 'CLIENT') {
      return res.status(403).json({ success: false, message: 'Ce portail de connexion est réservé aux clients.' });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// --- ADMIN ---

/**
 * @swagger
 * /api/admin/users/admin:
 *   post:
 *     tags: [Auth (Admin)]
 *     summary: Créer un compte Administrateur
 *     description: Permet à un Administrateur existant de créer un nouveau compte avec les mêmes droits absolus sur la plateforme.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nouveau Manager
 *               email:
 *                 type: string
 *                 example: nouveau@reservplace.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: adminsecret
 *     responses:
 *       201:
 *         description: Compte Administrateur provisionné
 *       403:
 *         description: Action refusée, vous n'êtes pas Administrateur
 */
export const registerAdmin = async (req, res, next) => {
  try {
    req.body.role = 'ADMIN';
    const result = await registerUseCase.execute(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/auth/admin/register-step1:
 *   post:
 *     tags: [Auth (Admin)]
 *     summary: Inscription Admin (Étape 1) - Demande de Code
 *     description: Démarre l'inscription d'un administrateur. Enregistre l'email et envoie un code de sécurité par email à valider pour confirmer l'identité.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@reservplace.com
 *     responses:
 *       200:
 *         description: Code envoyé
 *       400:
 *         description: Administrateur introuvable
 */
export const requestAdminCode = async (req, res, next) => {
  try {
    const result = await requestCodeUseCase.execute(req.body.email);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/auth/admin/register-step2:
 *   post:
 *     tags: [Auth (Admin)]
 *     summary: Inscription Admin (Étape 2) - Validation
 *     description: Finalise l'inscription de l'administrateur en validant l'email avec le code OTP reçu et en confirmant le mot de passe final.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@reservplace.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *                 description: Code à 6 chiffres reçu par email
 *               password:
 *                 type: string
 *                 example: adminsecret
 *     responses:
 *       200:
 *         description: Authentification validée
 *       400:
 *         description: E-mail, mot de passe ou code incorrect/expiré
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const result = await loginAdminUseCase.execute(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     tags: [Auth (Admin)]
 *     summary: Connexion Administrateur
 *     description: Authentifie un manager/administrateur en utilisant uniquement son adresse email et mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@reservplace.com
 *               password:
 *                 type: string
 *                 example: adminsecret
 *     responses:
 *       200:
 *         description: Authentification validée et token généré
 *       400:
 *         description: Email ou mot de passe incorrect
 *       403:
 *         description: Accès refusé (non administrateur)
 */
export const loginAdminSimple = async (req, res, next) => {
  try {
    const result = await loginUseCase.execute(req.body); // UseCase de base 
    if (result.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Ce portail de connexion est réservé aux administrateurs.' });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth (Commun)]
 *     summary: Profil de l'utilisateur connecté
 *     description: Récupère les informations de l'utilisateur (quel que soit son rôle) actuellement authentifié via son Token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur retourné (ID, nom, email, rôle)
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    res.status(200).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
};
