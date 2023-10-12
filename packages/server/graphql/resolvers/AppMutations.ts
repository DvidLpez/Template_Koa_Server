import { ConfigRepository } from "./../../../database/mongo/repository";
import { IConfigKey } from "./../../../core/interfaces/IConfigKey";

export default {
    Mutation: {
        /**
         * setNewKey
         */
         setKey: async (root: {}, args: { key: string, value: string}): Promise<IConfigKey> => {
            const { key, value } = args;
            let repository: ConfigRepository = new ConfigRepository();
            await repository.update(key, value);            
            return repository.findOne(key);            
        },
    }
}
