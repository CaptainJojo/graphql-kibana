const SQLCollector = require('./sqlCollector');
const _ = require('lodash');

class SQLGraphQLExtension {

    willSendResponse(graphqlResponse) {
        const { executionTime, queries } = SQLCollector;

        let logging = `--------- START MONITORING_SQL ---------\n`;
        logging += `Duration: ${executionTime} ms\n`;
        logging += `Numbers of queries: ${queries.length}\n`;
        logging += `Queries SQL: ${JSON.stringify(queries)}\n`;
        logging += `--------- END MONITORING_SQL ---------`;
        console.log(logging);

        graphqlResponse.context.logger.info('SQL COMPLETE', {
            httpHeader: JSON.stringify(graphqlResponse.graphqlResponse.http.headers),
            response: JSON.stringify(graphqlResponse.graphqlResponse.data),
            sqlExecutionTime: SQLCollector.executionTime,
            numbersOfSqlQueries: SQLCollector.queries.length,
            sqlQueries: JSON.stringify(queries)
        });

        _.forEach(SQLCollector.queries, (query) => {
            graphqlResponse.context.logger.info('SQL QUERY', {
                httpHeader: JSON.stringify(graphqlResponse.graphqlResponse.http.headers),
                response: JSON.stringify(graphqlResponse.graphqlResponse.data),
                sqlExecutionTime: query.executionTime,
                sqlQuery: query.query
            });
        });

        SQLCollector.reset();

        return graphqlResponse;
    }

    format() {
        return ['sql', {
            executionTime: SQLCollector.executionTime,
            numbersOfQueries: SQLCollector.queries.length,
            queries: SQLCollector.queries,
        }];
    }
}

module.exports = SQLGraphQLExtension;