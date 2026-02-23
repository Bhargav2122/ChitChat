import { JwtPayload } from "../utils/generateToken.ts";

declare module "socket.io" {
    interface Socket {
        userId: string,
    }
}