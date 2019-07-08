const { AuthenticationError, ForbiddenError, ApolloError } = require("apollo-server");
const { RESTDataSource: BaseRESTDataSource } = require('apollo-datasource-rest');
const RestCollector = require('./restCollector');

class RESTDataSource extends BaseRESTDataSource {
    initialize(config) {
        super.initialize(config);
        this.logger = config.context.logger;
    }

    willSendRequest(request) {
        this.startTime = process.hrtime();
        this.request = request;
    }

    getErrorFromResponseAndBody(response, body) {
        return {
            code: "INTERNAL_SERVER_ERROR",
            message: `${response.status}: ${response.statusText}`
        };
    }

    errorFromResponse(response, body) {
        const { message, code } = this.getErrorFromResponseAndBody(response, body);

        let error;
        if (response.status === 401) {
            error = new AuthenticationError(message);
        } else if (response.status === 403) {
            error = new ForbiddenError(message);
        } else {
            error = new ApolloError(message, code);
        }

        Object.assign(error.extensions, {
            response: {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                body,
            },
        });

        return error;
    }

    async didReceiveResponse(response, _request) {
        const hrend = process.hrtime(this.startTime);
        const body = await this.parseBody(response);

        const request = {
            url: response.url,
            method: this.request.method,
            params: this.request.params,
            headers: this.request.headers,
            status: response.status,
            statusText: response.statusText,
            error: !response.ok ? this.getErrorFromResponseAndBody(response, body) : null
        }

        const executionTimeRequest = hrend[1] / 1000000;
        RestCollector.addRequest({
            executionTimeRequest,
            request
        });


        if (response.ok) {
            return body;
        } else {
            throw this.errorFromResponse(response, body);
        }
    }
}

module.exports = RESTDataSource;