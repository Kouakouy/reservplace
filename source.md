# 🍽️ Backend API - Application de Réservation de Tables

## 📌 Description
Cette API permet de gérer un système complet de réservation de tables dans des restaurants.

Elle inclut :
- Gestion des restaurants
- Gestion des tables
- Réservations
- Authentification JWT
- Gestion des rôles (Admin / User)
- Recherche et pagination
- Vérification de disponibilité

---

# 🧠 Architecture

Ce projet utilise une combinaison de :
- Clean Architecture
- Domain Driven Design (DDD)
- Architecture Hexagonale (Ports & Adapters)

---

## 🏗️ Structure du projet
src/
│
├── domain/ # 🧠 Métier pur
│ ├── entities/
│ ├── repositories/
│ ├── services/
│
├── application/ # ⚙️ Cas d’usage
│ ├── use-cases/
│ ├── dtos/
│
├── infrastructure/ # 🔌 Implémentation technique
│ ├── database/
│ │ ├── models/
│ │ ├── repositories/
│ │
│ ├── auth/
│ ├── config/
│
├── interfaces/ # 🌐 API (Express)
│ ├── controllers/
│ ├── routes/
│ ├── middlewares/
│
├── shared/
│
├── app.js
└── server.js


---

# 🗄️ Base de Données (MongoDB Atlas)

##   User
- id
- name
- email
- password
- role (CLIENT | ADMIN)
- createdAt

## 🍽️ Restaurant
- id
- name
- address

## 🪑 Table
- id
- restaurantId
- capacity

## 📅 Reservation
- id
- userId
- tableId
- date
- startTime
- endTime
- status (ACTIVE | CANCELLED)
- createdAt

---

# 🧩 Domaine (DDD)

## 📌 Entity : Reservation

```js
export class Reservation {
  constructor({ userId, tableId, date, startTime, endTime }) {
    this.userId = userId;
    this.tableId = tableId;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = "ACTIVE";
  }

  cancel() {
    this.status = "CANCELLED";
  }
}
📌 Repository (Port)
export class ReservationRepository {
  async save(reservation) {}
  async findConflicts(tableId, date, start, end) {}
}
⚙️ Application (Use Cases)
📌 CreateReservation
export class CreateReservation {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async execute(data) {
    const conflicts = await this.reservationRepository.findConflicts(
      data.tableId,
      data.date,
      data.startTime,
      data.endTime
    );

    if (conflicts.length > 0) {
      throw new Error("Table déjà réservée");
    }

    const reservation = new Reservation(data);

    return await this.reservationRepository.save(reservation);
  }
}
🔌 Infrastructure (MongoDB)
📌 Mongoose Model
const ReservationSchema = new mongoose.Schema({
  user: mongoose.Types.ObjectId,
  table: mongoose.Types.ObjectId,
  date: Date,
  startTime: String,
  endTime: String,
  status: String
});
📌 Repository Implementation
export class MongoReservationRepository extends ReservationRepository {

  async save(reservation) {
    return await ReservationModel.create(reservation);
  }

  async findConflicts(tableId, date, start, end) {
    return await ReservationModel.find({
      table: tableId,
      date: date,
      status: "ACTIVE",
      $or: [
        {
          startTime: { $lt: end },
          endTime: { $gt: start }
        }
      ]
    });
  }
}
🌐 Interface (Express)
📌 Controller
export const createReservationController = (useCase) => async (req, res) => {
  try {
    const result = await useCase.execute(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
📌 Injection des dépendances
const repo = new MongoReservationRepository();
const useCase = new CreateReservation(repo);

router.post("/reservations", createReservationController(useCase));
🔐 Authentification
JWT
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
Middleware Auth
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
Middleware Role
if (req.user.role !== "ADMIN") {
  return res.status(403).json({ message: "Forbidden" });
}
🔥 Vérification de disponibilité
const existing = await Reservation.find({
  table: tableId,
  date: selectedDate,
  status: "ACTIVE",
  $or: [
    {
      startTime: { $lt: newEndTime },
      endTime: { $gt: newStartTime }
    }
  ]
});
🔍 Recherche & Pagination
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const results = await Model.find()
  .skip(skip)
  .limit(limit);
📜 Swagger Documentation
📌 Configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Reservation API",
      version: "1.0.0",
    },
    tags: [
      { name: "User", description: "Actions utilisateur" },
      { name: "Admin", description: "Actions administrateur" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  }
};
  Routes User
/**
 * @swagger
 * /reservations:
 *   post:
 *     tags: [User]
 *     summary: Créer une réservation
 *     security:
 *       - bearerAuth: []
 */
  Routes Admin
/**
 * @swagger
 * /restaurants:
 *   post:
 *     tags: [Admin]
 *     summary: Créer un restaurant
 *     security:
 *       - bearerAuth: []
 */
🚀 Déploiement
🌍 Stack
Node.js + Express
MongoDB Atlas
JWT
Swagger
📦 Hébergement
Backend : Render / Railway
Database : MongoDB Atlas
💎 Bonnes pratiques
Ne jamais mettre la logique métier dans les controllers
Toujours passer par les Use Cases
Utiliser des interfaces (Repository)
Séparer Domain / Infrastructure
Ajouter des index MongoDB
🎯 Résumé
Domain = logique métier
Application = cas d’usage
Infrastructure = MongoDB / JWT
Interface = Express
🔥 Améliorations possibles
Notifications email
Dashboard admin
Gestion des créneaux horaires
Système de notation
👨‍💻 Auteur

Projet backend conçu avec une architecture professionnelle (Clean + DDD + Hexagonal)
