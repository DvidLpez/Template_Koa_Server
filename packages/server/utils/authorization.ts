import jwtToken from 'jsonwebtoken';
import { setEnvironmentVariables } from './environment';

setEnvironmentVariables();

const secret = process.env.SEC_REST_SECRET ?? "";
const expireTime = '1h';


export const signJWT = (payload: any) : string => {
    return jwtToken.sign(
        {user: payload},
        secret,
        { expiresIn: expireTime }
    );
}

export const checkJWT = (userToken: string) => {
    return new Promise((resolve, reject) => {
        jwtToken.verify(userToken, secret, (err, decoded) => {
            err ? reject(err) : resolve(decoded);
        })
    })
}

export const refreshJWT = () => {
    
}

export  const initializeJWT = (clientIds:Array<string>) => {
    const secret = process.env.SEC_REST_SECRET ?? "";
    clientIds.forEach(clientId => {
        console.log(JSON.stringify({ 
            user: clientId, 
            token: jwtToken.sign(
                { user: clientId },
                secret,
                // {expiresIn: expireTime}
            )
        }));
    });
}