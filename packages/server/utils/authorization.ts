import jwt from 'jsonwebtoken';
import { UserEntity } from '../../database/mongo/entities';

export const signAccessJWT = (payload: UserEntity) : string => {
    return jwt.sign(
        {
            "UserInfo": {
                "username": payload.username,
                "roles": payload.role
            }
        },
        process.env.VAR_USER_ACCESS_TOKEN!,
        { expiresIn: process.env.VAR_EXPIRE_TIME_ACCESS_TOKEN! }
    );
}

export const signRefreshJWT = (payload: UserEntity) : string => {
    return jwt.sign(
        {username: payload.username},
        process.env.VAR_USER_REFRESH_TOKEN!,
        { expiresIn: process.env.VAR_EXPIRE_TIME_REFRESH_TOKEN! }
    );
}

export const checkAccessJWT = async (accessToken: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, process.env.VAR_USER_ACCESS_TOKEN!, (err, decoded) => {
            err ? reject(err) : resolve(decoded);
        })
    })
}

export const checkRefreshJWT = async (refreshToken: string) => {

    const checkRefresh: string | jwt.JwtPayload | jwt.VerifyErrors | undefined = new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.VAR_USER_REFRESH_TOKEN!, (err, decoded) => {
           err ? reject(err) : resolve(decoded);
        })
    })
    return checkRefresh;
}

export  const initializeTokensToThirdPartners = (clientIds:Array<string>) => {
    const secret = process.env.VAR_USER_ACCESS_TOKEN!;
    clientIds.forEach(clientId => {
        console.log(JSON.stringify({ 
            user: clientId, 
            accessToken: jwt.sign({ user: clientId },
                secret
            )
        }));
    });
}
