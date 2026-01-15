import { JwtPayload } from "./utils/generateToken.ts"

declare global {
    namespace Express {
        interface Request {
            user?:JwtPayload
        }
    }
}