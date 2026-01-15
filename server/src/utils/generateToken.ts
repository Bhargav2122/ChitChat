import jwt from 'jsonwebtoken';

export interface JwtPayload {
    _id:string,
    email: string,
}

export const generateToken = async(user: JwtPayload) => {
    return await jwt.sign({id:user._id.toString(), email: user.email}, process.env.JWT_SECRET_KEY as string, {expiresIn:"7d"})
}