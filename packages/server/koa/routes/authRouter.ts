import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import { handleSignup, handleLogin, handleLogout, handleRefreshToken } from "../controllers/authController";

export const authRoutes = () => {
    const authRouter: KoaRouter = new KoaRouter();
    authRouter.use(bodyParser())
    authRouter.post("/signup", handleSignup);
    authRouter.post("/login", handleLogin);
    authRouter.get("/logout", handleLogout);
    authRouter.get("/refresh", handleRefreshToken);
    return authRouter;
}
