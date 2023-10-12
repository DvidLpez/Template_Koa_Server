import { MongoRepository } from "typeorm";
import { ConfigEntity } from "../entities";
import { mongoConnection } from "../datasource";
import { IConfigKey } from "../../../core/interfaces";

export class ConfigRepository {

    private repository: MongoRepository<ConfigEntity>;

    constructor () {
        this.repository = mongoConnection.getMongoRepository(ConfigEntity);
    }

    public async all() {
        const result = await this.repository.findAndCount();
        return {
            elements: result[0],
            amount: result[1]
        }
    }

    /**
     * Find one by config key
     * @param {string} key
     */
     public async findOne(key: string): Promise<ConfigEntity> {
        let found = await this.repository.findOne({ where: { key:key } });
        
        if (!found) {
            throw new Error(`Configuration key ${key} does not exist`);
        }
        return found;
    }

    /**
     * Create or update new key
     * @param {IConfigKey} configKey
     */
     public async update(configKey: IConfigKey) {
        let found = await this.repository.findOne({where: { key: configKey.name }})
        let entity = this.repository.create({key: configKey.name, value: configKey.value});
        if (found) {
            entity.id = found.id;
        }
        return await this.repository.save(entity);
    }
}
