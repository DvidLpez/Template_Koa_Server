import { ApolloServer, gql } from "apollo-server-koa";
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

export const createApolloServer = () => {
    // Create Apollo Server
    return new ApolloServer({
        typeDefs: gql(`
            type Query
            type Mutation
            schema {
                query: Query
                mutation: Mutation
            }
            ${schema}
        `),
        playground: {
            settings: {
                // Avoid CORS errors for GraphQL UI
                'request.credentials': ''
            }
        },
        cacheControl: {
            defaultMaxAge: 0,
        },
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
}
