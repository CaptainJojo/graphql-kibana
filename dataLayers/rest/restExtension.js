const RestCollector = require('./restCollector');
const _ = require('lodash');

class RestExtension {

    willSendResponse(graphqlResponse) {

        if (process.env.DEBUG === true) {
            let logging = `--------- START_MONITORING_REST ---------\n`;
            logging += `Duration min request: ${RestCollector.minExecutionTimeRequest} ms\n`;
            logging += `Duration max request: ${RestCollector.maxExecutionTimeRequest} ms\n`;
            logging += `Duration total request: ${RestCollector.globalExecutionTimeRequest} ms\n`;
            logging += `Numbers of requests: ${RestCollector.requests.length}\n`;
            logging += `Requests REST: ${JSON.stringify(RestCollector.requests)}\n`;
            logging += `--------- END_MONITORING_REST ---------`;
            console.log(logging);
        }

        graphqlResponse.context.logger.info('REST COMPLETE', {
            httpHeader: JSON.stringify(graphqlResponse.graphqlResponse.http.headers),
            minExecutionTimeRequest: RestCollector.minExecutionTimeRequest,
            maxExecutionTimeRequest: RestCollector.maxExecutionTimeRequest,
            globalExecutionTimeRequest: RestCollector.globalExecutionTimeRequest,
            numbersOfSqlQueries: RestCollector.requests.length,
            requests: JSON.stringify(RestCollector.requests)
        });

        _.forEach(RestCollector.requests, (request) => {
            graphqlResponse.context.logger.info('REST QUERY', {
                executionTimeRequest: request.executionTimeRequest,
                request: request.request
            });
        });

        RestCollector.reset();

        return graphqlResponse;
    }

    format() {
        return ['rest', {
            minExecutionTimeRequest: RestCollector.minExecutionTimeRequest,
            maxExecutionTimeRequest: RestCollector.maxExecutionTimeRequest,
            globalExecutionTimeRequest: RestCollector.globalExecutionTimeRequest,
            numbersOfRequests: RestCollector.requests.length,
            requests: RestCollector.requests,
        }];
    }
}

module.exports = RestExtension;