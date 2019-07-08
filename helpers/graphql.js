const fs = require("fs");
const path = require("path");
const { merge } = require("lodash");
const { print } = require("graphql");
const { PubSub } = require("apollo-server-express");
const { searchRecursive } = require("./fs");

const rootDir = path.resolve(__dirname, "..");

class GraphQLHelper {
  constructor() {
    this.subscriptions = {
      resolvers: null,
      EVENTS: null
    };
    this._pubSub = null;
  }

  /**
   * Get GraphQL typeDefs
   *
   * @method typeDefs
   *
   * @return {String}
   */
  get typeDefs() {
    const graphqlSchemaPath = `${rootDir}/schema.graphql`;
    if (
      process.env.NODE_ENV === "production" &&
      fs.existsSync(graphqlSchemaPath)
    ) {
      return fs.readFileSync(graphqlSchemaPath, { encoding: "utf8" });
    }

    const definitionsPath = `${rootDir}/definitions`;
    if (!fs.existsSync(definitionsPath)) {
      throw new Error(
        "You did not define the type definition language of the graphQL !"
      );
    }

    let filesGraphQL = searchRecursive(definitionsPath, ".graphql");
    let filesJs = searchRecursive(definitionsPath, ".js");

    let definitions = filesGraphQL.reduce((acc, file) => {
      acc += fs.readFileSync(file, { encoding: "utf8" }) + "\n";
      return acc;
    }, "");

    for (let key in filesJs) {
      const currentDefinitions = require(filesJs[key]);
      if (Array.isArray(currentDefinitions)) {
        definitions += currentDefinitions.reduce((acc, typeDef) => {
          acc += print(typeDef);
          return acc;
        }, "");
      } else {
        definitions += print(currentDefinitions);
      }
    }

    if (process.env.NODE_ENV === "production") {
      fs.writeFileSync(graphqlSchemaPath, definitions);
    }

    return definitions;
  }

  /**
   * Get GraphQL dataSources
   *
   * @method dataSources
   *
   * @return {Object}
   */
  get dataSources() {
    let dataSources = {};

    const dataSourcesPath = `${rootDir}/dataSources`;
    if (fs.existsSync(dataSourcesPath)) {
      let files = searchRecursive(dataSourcesPath, ".js");
      for (let key in files) {
        const currentDataSource = require(files[key]);
        dataSources = merge(dataSources, {
          [currentDataSource.name]: new currentDataSource()
        });
      }
    }

    return dataSources;
  }

  /**
   * Get resolvers
   *
   * @method resolvers
   *
   * @return {Objext}
   */
  get resolvers() {
    let resolvers = { Subscription: this.subscriptionsResolvers };

    const resolversPath = `${rootDir}/resolvers`;
    if (fs.existsSync(resolversPath)) {
      let files = searchRecursive(resolversPath, ".js");
      for (let key in files) {
        resolvers = merge(resolvers, require(files[key]));
      }
    }

    return resolvers;
  }

  /**
   * Get GraphQL schemaDirectives
   *
   * @method schemaDirectives
   *
   * @return {Object}
   */
  get schemaDirectives() {
    let directives = {};

    const directivesPath = `${rootDir}/directives`;
    if (fs.existsSync(directivesPath)) {
      let files = searchRecursive(directivesPath, ".js");
      for (let key in files) {
        const currentDirective = require(files[key]);
        directives = merge(directives, {
          [currentDirective.name]: currentDirective
        });
      }
    }

    return directives;
  }

  initSubscriptionsResolversAndEvents() {
    let EVENTS = {};
    let resolvers = {};

    const subscriptionsPath = `${rootDir}/subscriptions`;
    if (fs.existsSync(subscriptionsPath)) {
      let files = searchRecursive(subscriptionsPath, ".js");
      for (let key in files) {
        const {
          EVENTS: CURRENT_EVENT,
          resolvers: currentResolvers
        } = require(files[key]);
        EVENTS = { ...EVENTS, ...CURRENT_EVENT };
        resolvers = merge(resolvers, currentResolvers);
      }
    }

    this.subscriptions.resolvers = resolvers;
    this.subscriptions.EVENTS = EVENTS;

    return this.subscriptions;
  }

  /**
   * Get GraphQL subscriptions resolvers
   *
   * @method subscriptionsResolvers
   *
   * @return {Object}
   */
  get subscriptionsResolvers() {
    if (!this.subscriptions.resolvers) {
      this.initSubscriptionsResolversAndEvents();
    }

    return this.subscriptions.resolvers;
  }

  /**
   * Get GraphQL subscriptions events
   *
   * @method SUBSCRIPTIONS_EVENTS
   *
   * @return {Object}
   */
  get SUBSCRIPTIONS_EVENTS() {
    if (!this.subscriptions.EVENTS) {
      this.initSubscriptionsResolversAndEvents();
    }

    return this.subscriptions.EVENTS;
  }

  /**
   * Get GraphQL Pub Sub
   */
  get pubSub() {
    if (!this._pubSub) {
      this._pubSub = new PubSub();
    }

    return this._pubSub;
  }
}

module.exports = new GraphQLHelper();
