import Koa, { Context } from "koa";
import KoaRouter from "koa-router";
import { createApolloServer } from "../graphql/server"
import { initializeTokensToThirdPartners, setEnvironmentVariables } from '../utils';
import { initializeDataBase, mongoConnection } from '../../database';
import { configRoutes } from "./routes/configRouter";
import { authRoutes } from "./routes/authRouter";

// Config .env files
setEnvironmentVariables();
process.env.VAR_NODE_ENV == "production" 
  ? console.log('Production environment with file .env.production')
  : console.log('Default environment with file .env.development');

// Create Koa server application
const app = new Koa();



// Create a router
const router = new KoaRouter();

// Create Apollo Server GraphQL & Routes
//createApolloServer(router);

// Expose alive route
router.get("/alive", (ctx: Context) => { ctx.body = { success: true }; });

// Expose app configuration route
router.get("/info", (ctx: Context) => { 
    ctx.status = 200;
    ctx.body = { version: "1.0.0", build: "Template Koa Server" }; 
});

// REST routes
app.use(authRoutes().routes());
app.use(configRoutes().routes());

// Apply middlewares
app.use(router.routes());
app.use(router.allowedMethods());

// Initialize database
initializeDataBase(mongoConnection);

// Init JWT tokens for REST endpoints to third partners
initializeTokensToThirdPartners(['Company1', 'Company2']);

// Listen to webserver port
const port = process.env.VAR_PORT || 4000;
app.proxy = true;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
