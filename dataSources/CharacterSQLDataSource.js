const { SQLDataSource } = require("../dataLayers/sql");
const DataLoader = require("dataloader");

class CharacterSQLDataSource extends SQLDataSource {
  initialize(config) {
    const { Database } = config.context.dataLayers.sql;
    this.Database = Database;
  }


  get characters() {
    return this.Database.from("character");
  }

  async findCharacterById(id) {
    return this.dataLoaders.characterById.load(id);
  }

  async addFather(key, fatherKey) {
    await this.Database.table("character")
      .where("id", key)
      .update({
        father_id: fatherKey
      });

    const character = await this.Database.table("character")
      .where("id", key);

    return character;
  }

  get characters() {
    return this.Database.table("character").orderBy('id')
  }

  get dataLoaders() {
    if (!this._dataLoaders) {
      this._dataLoaders = {
        characterById: this._characterByIdDataLoader
      };
    }

    return this._dataLoaders;
  }

  get _characterByIdDataLoader() {
    return new DataLoader(ids =>
      this.Database.from("character")
        .whereIn("id", ids)
        .then(items =>
          ids.map(id =>
            items.find(({ id: currentId }) => currentId === id)
          )
        )
    );
  }
}

module.exports = CharacterSQLDataSource;
