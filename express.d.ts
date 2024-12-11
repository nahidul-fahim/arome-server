import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string,
        role: string,
        iat: number,
        exp: number
      };
    }
  }
}
