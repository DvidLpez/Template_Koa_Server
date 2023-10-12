import { Context } from 'koa';
import bcrypt from 'bcrypt';
import { UserRepository } from "../../../database/mongo/repository";
import { signAccessJWT, checkRefreshJWT, signRefreshJWT } from '../../utils/authorization';

export const handleSignup = async(ctx: Context) => {

    try {
        let params = getRequestBodyParams(ctx.request.body);
        const { username, password } = params;

        if (!username || !password)
            ctx.throw(400, 'User or password required');

        let duplicate = await new UserRepository().findOneByUsername(username);
        
        if(duplicate)
            ctx.throw(409, 'Username exist');

        await new UserRepository().create(username, password);

        {
            ctx.status = 201;
            ctx.body = JSON.stringify({ success: `New user ${username} created!`});
        }
    }
    catch (error: any) {
        ctx.status = error.status;
        ctx.body = JSON.stringify({ error: error.message });
    }
}

export const handleLogin = async(ctx: Context) => {

    try {
        let params = getRequestBodyParams(ctx.request.body);
        const { username, password } = params;
        
        if (!username || !password)
            ctx.throw(400, 'User and password required');

        let foundUser = await new UserRepository().findOneByUsername(username);
        
        if(!foundUser){
            ctx.throw(400, 'Invalid credentials');
        }

        // Evaluate password
        const match = await bcrypt.compare(password, foundUser.password);
        
        if(match){

            const accessToken = signAccessJWT(foundUser);
            const newRefreshToken = signRefreshJWT(foundUser);

            // Changed to let keyword
            let newRefreshTokenArray = !ctx.cookies.get("jwt")
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== ctx.cookies.get("jwt"));

            if (ctx.cookies.get("jwt")) {
                /* 
                Scenario added here: 
                    1) User logs in but never uses RT and does not logout 
                    2) RT is stolen
                    3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
                */
                const refreshToken = ctx.cookies.get("jwt");
                const foundToken = await new UserRepository().findOneByRefreshToken(refreshToken!);
    
                // Detected refresh token reuse!
                if (!foundToken) {
                    console.log('Attempted refresh token reuse at login!')
                    // clear out ALL previous refresh tokens
                    newRefreshTokenArray = [];
                }

                // Secure must be true in the production 
                 ctx.cookies.set("jwt", null ,{ httpOnly: true, sameSite: 'none', secure: false });
            }

            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await new UserRepository().update(foundUser);

            // Creates Secure Cookie with refresh token (secure must be true in the production)
            ctx.cookies.set("jwt", newRefreshToken, { httpOnly: true, secure: false, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

            {
                ctx.status = 200;
                ctx.body = JSON.stringify({ accessToken: accessToken, roles: foundUser.role});
            }
        
        }else{
            ctx.throw(401, 'Invalid credentials');
        }
    }
    catch (error: any) {
        ctx.status = error.status;
        ctx.body = JSON.stringify({ error: error.message });
    }
}

export const handleLogout = async (ctx: Context) => {
    try {

        // On client, also delete the accessToken
        if(ctx.cookies.get("jwt")){
            const refreshToken = ctx.cookies.get("jwt");

            // Secure must be true in the production 
            ctx.cookies.set('jwt', null, { httpOnly: true, sameSite: "none", secure: false })

            // Is refreshToken in db?
            const foundUser = await new UserRepository().findOneByRefreshToken(refreshToken!);

            if(foundUser) {
                // Delete refreshToken in db
                foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
                await new UserRepository().update(foundUser);
            }         
        }

        {
            ctx.status = 204
        }
    }
    catch (error: any) {
        ctx.status = error.status;
        ctx.body = JSON.stringify({ error: error.message });
    }
}

export const handleRefreshToken = async (ctx: Context) => {
    try{
        
        if(!ctx.cookies.get("jwt")){
            {
                ctx.status = 204;
            }
        }else{

            const refreshToken = ctx.cookies.get("jwt");

            // Secure must be true in the production 
            ctx.cookies.set('jwt', null, {httpOnly: true, sameSite: "none", secure: false})

            const foundUser = await new UserRepository().findOneByRefreshToken(refreshToken!);
            
            // Detect refresh token reuse!
            if(!foundUser) {

                try {
                    const decoded = await checkRefreshJWT(refreshToken!);

                    console.log('Attempted refresh token reuse!')
                    let hackedUser = await new UserRepository().findOneByUsername(decoded.username);

                    if(hackedUser){
                        hackedUser.refreshToken = [];
                        await new UserRepository().update(hackedUser);
                    }
                
                } catch (error) {
                    {
                        ctx.status = 403;
                        ctx.body = JSON.stringify({ error: "Forbidden" });
                    }
                } finally {
                    {
                        ctx.status = 403;
                        ctx.body = JSON.stringify({ error: "Forbidden" });
                    }
                }
                
            }else{
                
                const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);
                
                try {

                    const decoded = await checkRefreshJWT(refreshToken!);
    
                    if(foundUser.username !== decoded.username){
                        {
                            ctx.status = 403;
                            ctx.body = JSON.stringify({ error: "Forbidden" });
                        }
                    }else{
    
                        const accessToken = signAccessJWT(foundUser);
                        const newRefreshToken = signRefreshJWT(foundUser);
    
                        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
                        await new UserRepository().update(foundUser);
                    
                        // Creates Secure Cookie with refresh token
                        ctx.cookies.set("jwt", newRefreshToken, { httpOnly: true, secure: false, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
    
                        {
                            ctx.status = 200;
                            ctx.body = JSON.stringify({ accessToken: accessToken, roles: foundUser.role});
                        }
                    }
    
                } catch (error) {
                    console.log('Expired refresh token')
                    foundUser.refreshToken = [...newRefreshTokenArray];
                    await new UserRepository().update(foundUser);
                    
                    {
                        ctx.status = 403;
                        ctx.body = JSON.stringify({ error: "Forbidden" });
                    }
                }
            }
        }

    }catch(error: any){
        ctx.status = error.status;
        ctx.body = JSON.stringify({ error: error.message });
    }
}

const getRequestBodyParams = (bodyParams: any) => {
    return {
        username: bodyParams.username ?? null,
        password: bodyParams.password ?? null,
    }
}
