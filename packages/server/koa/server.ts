import dotenv from "dotenv";
import Koa, { Context } from "koa";
import KoaRouter from "koa-router";
import { createApolloServer } from "../graphql/server"
import { initializeDataBase, initializeJWT } from '../utils/utils';
import { mongoConnection, mysqlConnection } from '../../database';
import { configRoutes } from "./routes/configRouter";
// import 'isomorphic-fetch';
// import CronJob from '../cronjob';

switch(process.env.VAR_NODE_ENV) {
  case 'production':
    console.log('Production environment with file .env.production');
      dotenv.config({ path: '.env.production' });
      break;
  default:
      console.log('Default environment with file .env.development');
      dotenv.config({ path: '.env.development' });
      break;
}

// Create Koa server application
const app = new Koa();

// Create a router
const router = new KoaRouter();

// Create Apollo Server
const apolloServer = createApolloServer();

// Expose alive route
router.get("/alive", (ctx: Context) => { ctx.body = { success: true }; });

// Expose app configuration route
router.get("/config", (ctx: Context) => { 
    ctx.status = 200;
    ctx.body = { version: "1.0.0", build: "Template Koa Server" }; 
});

// REST routes
app.use(configRoutes().routes());

// Graphql routes
router.get("/graphql", apolloServer.getMiddleware());
router.post("/graphql", apolloServer.getMiddleware());

// Apply middlewares
app.use(router.routes());
app.use(router.allowedMethods());

// Initialize DataSources
initializeDataBase(mongoConnection);

// Init JWT tokens for REST endpoints features
initializeJWT(['TEST_CUSTOMER']);

// Listen to webserver port
const port = process.env.VAR_PORT || 3000;
app.proxy = true;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
