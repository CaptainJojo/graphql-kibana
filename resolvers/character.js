const resolvers = {
    Query: {
        characters: async (parent, args, { dataSources: { CharacterSQLDataSource } }, info) => CharacterSQLDataSource.characters,
    },
    Mutation: {
        addFather: async (parent, { key, fatherKey }, { dataSources: { CharacterSQLDataSource } }, info) => CharacterSQLDataSource.addFather(key, fatherKey),
    },
    Character: {
        gender: (parent) => parent.male ? 'MALE' : 'FEMALE',
        mother: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.mother ? CharacterRESTDataSource.findCharacterBySlug(parent.mother) : null,
        father: (parent, args, { dataSources: { CharacterSQLDataSource } }) => parent.father_id ? CharacterSQLDataSource.findCharacterById(parent.father_id) : null,
    }
};

module.exports = resolvers;
