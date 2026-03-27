import jwt from 'jsonwebtoken';

export class JwtService {
  sign(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
