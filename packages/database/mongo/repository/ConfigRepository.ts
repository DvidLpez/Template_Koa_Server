import { MongoRepository } from "typeorm";
import { mongoConnection } from "../connection";
import { ConfigEntity } from "../entity/ConfigEntity";

export default class ConfigRepository {
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
     * Update key value in database
     * @param {string} keyName
     */
     public async update(keyName: string, keyValue: string | number) {
        let found = await this.repository.findOne({where: { key: keyName }})
        let entity = this.repository.create({key: keyName, value: keyValue});
        if (found) {
            entity.id = found.id;
        }
        return await this.repository.save(entity);
    }
}
