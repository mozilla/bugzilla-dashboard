import jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';

export default jwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI,
  }),
  issuer: process.env.JWT_ISSUER,
  algorithms: ['RS256'],
});
