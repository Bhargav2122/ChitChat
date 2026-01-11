import { JwtPayload } from "../utils/generateToken.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; 
    }
  }
}