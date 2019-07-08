const { RESTDataSource } = require("../dataLayers/rest");

class CharacterRESTDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://game-of-throne-api.appspot.com/api";
  }

  getErrorFromResponseAndBody(response, body) {
    let code = "INTERNAL_SERVER_ERROR";
    if (response.status === 404) {
      code = "NOT_FOUND";
    }
    return {
      code: code,
      message: body.error.message
    };
  }

  get characters() {
    return this.get("/characters");
  }

  async findCharacterBySlug(slug) {
    const characters = await this.characters;
    return characters.find(character => character.slug === slug);
    // return this.get(`/character/${slug}`);
  }
}

module.exports = CharacterRESTDataSource;
