const SQLCollector = require('./sqlCollector');
const ELk = require('./../../helpers/logger');

/**
 * Return SQL string with inserted bindings
 *
 * @param {String} sql - sql string without bindings
 * @param {Array} bindings
 * @return {String}
 */
const insertBindingsToSQL = (sql, bindings) => {
    return sql.split('?').reduce((memo, part, index) => {
        const binding = bindings[index] ? JSON.stringify(bindings[index]) : '';
        return memo + part + binding;
    }, '');
};

/**
 * Decorate `knex` instance with logger
 *
 * @param {Object} knex - knex instance
 * @param {Object} options
 * @return {Object} knex - knex instance
 */
const Logger = (knex) => {
    const queries = {};
    knex
        .on('query', ({ sql, bindings, __knexQueryUid: queryId }) => {
            const startTime = process.hrtime();
            queries[queryId] = { sql, bindings, startTime };
        })
        .on('query-error', (_error, { __knexQueryUid: queryId }) => {
            ELk().error('Query Error', {
                error: _error
            });

            delete queries[queryId];
        })
        .on('query-response', (response, { __knexQueryUid: queryId }) => {
            const { sql, bindings, startTime } = queries[queryId];
            delete queries[queryId];

            const
                hrend = process.hrtime(startTime),
                query = insertBindingsToSQL(sql, bindings);

            SQLCollector.addQuery({
                executionTime: hrend[1] / 1000000,
                query: query
            });
        });

    return knex;
}

module.exports = Logger;