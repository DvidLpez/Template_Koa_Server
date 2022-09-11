import ConfigRepository from "../../../database/mongo/repository/ConfigRepository";

export default {
    Query: {
         getKeyList: async (root: {}, args: {}): Promise<any> => {
            const repository: ConfigRepository = new ConfigRepository();
            const result = await repository.all();
            return {
                elements:result.elements,
                amount: result.amount
    
            }
        },
        getKeyValue: async (root: {}, args: { key: string}): Promise<any> => {
            const { key } = args;
            const repository: ConfigRepository = new ConfigRepository();
            const result = await repository.findOne(key);
            return {
                key: result.key,
                value: result.value
            }
        }
    }
}