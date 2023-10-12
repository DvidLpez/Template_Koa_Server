import { ApolloServer, AuthenticationError, gql, ValidationError } from "apollo-server-koa";
import { ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled, ApolloServerPluginCacheControl  } from 'apollo-server-core';
import { readdirSync, readFileSync } from "fs";
import { join as pathJoin } from "path";
import AppQueries from "./resolvers/AppQueries";
import AppMutations from "./resolvers/AppMutations";
import { checkAccessJWT } from "../utils";


// Fetch all schema definition files
const schemaFiles = readdirSync(pathJoin(__dirname, "schema")).filter(
    file => file.indexOf(".graphql") > 0
);

// Concatenate them to create our schema
const schema = schemaFiles
    .map(file => readFileSync(pathJoin(__dirname, `schema/${file}`)).toString())
    .join();

export const createApolloServer = async(router: any) => {
    // Create Apollo Server
    const graphqlServer = new ApolloServer({
        typeDefs: gql(`
            type Query
            type Mutation
            schema {
                query: Query
                mutation: Mutation
            }
            ${schema}
        `),
        plugins: [
            process.env.NODE_ENV === 'production'
              ? ApolloServerPluginLandingPageDisabled()
              : ApolloServerPluginLandingPageGraphQLPlayground(),
            
            ApolloServerPluginCacheControl({
                defaultMaxAge: 0
              }),
        ],
        resolvers: {
            Query: AppQueries.Query,
            Mutation: AppMutations.Mutation
        },
        context: async ({ ctx }: any) => {
            // get the user token from the headers
            const token = ctx.headers.authorization || '';

            if (!token) 
                throw new AuthenticationError('you must be logged in');

            // try to retrieve a user with the token
            try{
                let user = await checkAccessJWT(token.split(' ')[1]);
                console.log(user);

            }catch(err: any){
                throw new ValidationError(err.message);
            }
        },
        formatError: (error: Error) => {
            console.log(JSON.stringify({ message: error.message, name: error.name }));
            // Show complete error
            return error;
        }
    });

    await graphqlServer.start();

    router.get("/graphql", graphqlServer.getMiddleware());
    router.post("/graphql", graphqlServer.getMiddleware());
}
