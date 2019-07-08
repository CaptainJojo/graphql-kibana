"use strict";

class SQLCollector {
  constructor() {
    this._initializeData();
  }

  _initializeData() {
    this.executionTime = 0;
    this.queries = [];
  }

  reset() {
    this._initializeData();
  }

  addQuery({ executionTime, query }) {
    this.executionTime += executionTime;
    this.queries.push({
      executionTime: executionTime,
      query
    });

    return this;
  }

  static getInstance() {
    if (!SQLCollector.instance) {
      SQLCollector.instance = new SQLCollector();
    }

    return SQLCollector.instance;
  }
}

module.exports = SQLCollector.getInstance();
