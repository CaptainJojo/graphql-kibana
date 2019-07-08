const _ = require('lodash');

class LoggerExtension {
    requestDidStart(request) {

        request.context.logger.info('REQUEST', {
            query: request.queryString,
        });
    }

    willSendResponse(graphqlResponse) {
        if (graphqlResponse.graphqlResponse.errors !== undefined) {
            graphqlResponse.context.logger.error('COMPLETE', {
                httpHeader: JSON.stringify(graphqlResponse.graphqlResponse.http.headers),
                response: JSON.stringify(graphqlResponse.graphqlResponse.data),
                errors: JSON.stringify(graphqlResponse.graphqlResponse.errors),
                trace: graphqlResponse.graphqlResponse.errors
            });
        } else {

            graphqlResponse.context.logger.info('COMPLETE', {
                httpHeader: JSON.stringify(graphqlResponse.graphqlResponse.http.headers),
                response: JSON.stringify(graphqlResponse.graphqlResponse.data),
                errors: JSON.stringify(graphqlResponse.graphqlResponse.errors),
                trace: graphqlResponse.graphqlResponse.errors
            });
        }

        return graphqlResponse;
    }
}

module.exports = LoggerExtension;