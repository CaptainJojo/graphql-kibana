const DataLoader = require("dataloader");
const { RESTDataSource } = require("../dataLayers/rest");

class HouseRESTDataSource extends RESTDataSource {
    get baseURL() {
        return this.context.ENDPOINT_GOT_API;
    }

    get limitRequest() {
        return this.context.LIMIT_REQUEST || 25;
    }

    get houses() {
        return this.get("/houses");
    }

    findHouseByKey(key) {
        return this.dataLoaders.houseByKey.load(key);
    }

    get dataLoaders() {
        if (!this._dataLoaders) {
            this._dataLoaders = {
                houseByKey: this._houseByKeyDataLoader
            }
        }

        return this._dataLoaders;
    }

    get _houseByKeyDataLoader() {
        return new DataLoader(keys => {
            let promise;
            if (keys.length > this.limitRequest) {
                promise = this.houses;
            } else {
                const promises = keys.map(key => this.get(`/house/${key}`).catch(error => {
                    if (error.extensions.response.status === 404) {
                        return {};
                    }
                    return error;
                }));
                promise = Promise.all(promises);
            }

            return promise.then(items => keys.map(key => items.find(({ key: currentKey }) => currentKey === key)));
        });
    }
}

module.exports = HouseRESTDataSource;