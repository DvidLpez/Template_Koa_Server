import { ApolloServer, gql } from "apollo-server-koa";
import { ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled, ApolloServerPluginCacheControl  } from 'apollo-server-core';
import { readdirSync, readFileSync } from "fs";
import { join as pathJoin } from "path";
import AppQueries from "./resolvers/AppQueries";
import AppMutations from "./resolvers/AppMutations";


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
            return console.log( "Waiting query or mutation...");
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
