const { ApolloError } = require("apollo-server");

const resolvers = {
    Query: {
        houses: async (
            parent,
            args,
            { dataSources: { HouseRESTDataSource } },
            info
        ) => HouseRESTDataSource.houses,
        house: (
            parent,
            { key },
            { dataSources: { HouseRESTDataSource } },
            info
        ) => HouseRESTDataSource.findHouseByKey(key).then(house => house ? house : new ApolloError("House not found.", "RESOURCE_NOT_FOUND")),
    },
    House: {
        lord: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.lordKey ? CharacterRESTDataSource.findCharacterByKey(parent.lordKey) : null,
        heirs: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.heirsKey ? CharacterRESTDataSource.filterCharactersByKeys(parent.heirsKey) : null,
        characters: (parent, args, { dataSources: { CharacterRESTDataSource } }) => CharacterRESTDataSource.filterCharactersByHouseKey(parent.key),
    }
};

module.exports = resolvers;