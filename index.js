const { ApolloServer, ApolloError } = require("apollo-server");
const GraphQLHelper = require("./helpers/graphql");
const Logger = require('./helpers/logger');
const { RestExtension } = require("./dataLayers/rest");
const { SQLExtension, Database } = require("./dataLayers/sql");
const express = require('express');
const LoggerExtension = require('./dataLayers/LoggerExtension');

const app = express();
const port = process.env.PORT || 4000;
const server = new ApolloServer({
    typeDefs: GraphQLHelper.typeDefs,
    schemaDirectives: GraphQLHelper.schemaDirectives,
    resolvers: GraphQLHelper.resolvers,
    dataSources: () => GraphQLHelper.dataSources,
    context: ({ req }) => {
        let { ENDPOINT_GOT_API } = process.env;
        if (process.env.NODE_ENV === "production" && !ENDPOINT_GOT_API) {
            throw new ApolloError(
                "You have not set the `ENDPOINT_GOT_API` environment variable !"
            );
        } else {
            ENDPOINT_GOT_API = "https://game-of-throne-api.appspot.com/api";
        }

        console.log("ENDPOINT_GOT_API", ENDPOINT_GOT_API);

        return {
            logger: Logger({ req }),
            ENDPOINT_GOT_API,
            dataLayers: {
                sql: {
                    Database,
                }
            }
        };
    },
    engine: {
        apiKey: "service:CaptainJojo-9556:zYx_pkxqMfES2wOKFuZ5mA"
    },
    extensions: [() => new RestExtension(), () => new SQLExtension(), () => new LoggerExtension()],
});

server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
