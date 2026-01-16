import jwt from 'jsonwebtoken';

export interface JwtPayload {
    id:string,
    email: string,
}

export const generateToken = (user: JwtPayload) => {
    return  jwt.sign({id:user.id.toString(), email: user.email}, process.env.JWT_SECRET_KEY as string, {expiresIn:"7d"})
}