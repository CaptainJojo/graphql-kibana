class RestCollector {
  constructor() {
    this._initializeData();
  }

  _initializeData() {
    this.globalExecutionTimeRequest = 0;
    this.maxExecutionTimeRequest = null;
    this.minExecutionTimeRequest = null;
    this.requests = [];
  }

  reset() {
    this._initializeData();
  }

  addRequest({ executionTimeRequest, request }) {
    if (
      !this.maxExecutionTimeRequest ||
      executionTimeRequest > this.maxExecutionTimeRequest
    ) {
      this.maxExecutionTimeRequest = executionTimeRequest;
    }
    if (
      !this.minExecutionTimeRequest ||
      executionTimeRequest < this.minExecutionTimeRequest
    ) {
      this.minExecutionTimeRequest = executionTimeRequest;
    }
    this.globalExecutionTimeRequest += executionTimeRequest;
    this.requests.push({
      executionTimeRequest: executionTimeRequest,
      request
    });

    return this;
  }

  static getInstance() {
    if (!RestCollector.instance) {
      RestCollector.instance = new RestCollector();
    }

    return RestCollector.instance;
  }
}

module.exports = RestCollector.getInstance();