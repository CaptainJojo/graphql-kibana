const logger = require('gelf-pro');
const uniqid = require('uniqid');

const Logger = (args) => {
    const stage = process.env.STAGE || 'dev';
    if (args) {
        const { req } = args;
        logger.tokenGlobal = req.headers['x-token-global'] ? req.headers['x-token-global'] : uniqid('global_');
        logger.tokenProcess = req.headers['x-token-process'] ? req.headers['x-token-process'] : uniqid('process_');
    } else {
        logger.tokenGlobal = uniqid('global_');
        logger.tokenProcess = uniqid('process_');
    }

    logger.setConfig({
        fields: {
            type: 'gelf',
            stage,
            host: `graphql`,
            facility: 'app',
            token_global: logger.tokenGlobal,
            token_process: logger.tokenProcess,
        },
        adapterOptions: {
            host: 'logstash',
            port: 12201,
        },
    });

    return logger;
};

module.exports = Logger;