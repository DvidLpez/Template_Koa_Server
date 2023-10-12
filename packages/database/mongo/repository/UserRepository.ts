import { MongoRepository } from "typeorm";
import { mongoConnection } from "../datasource";
import { IUserEntity, UserEntity } from "../entities";
import bcrypt from 'bcrypt';

export class UserRepository {
    private repository: MongoRepository<UserEntity>;

    constructor () {
        this.repository = mongoConnection.getMongoRepository(UserEntity);
    }

    public async all() {
        const result = await this.repository.findAndCount();
        return {
            elements: result[0],
            amount: result[1]
        }
    }

    /**
     * Find one by username
     * @param {string} username
     */
     public async findOneByUsername(username: string): Promise<UserEntity | null> {
        let found = await this.repository.findOne({ where: { username:username } });
        return found;
    }

    /**
     * Find one by refreshToken
     * @param {string} refreshToken
     */
    public async findOneByRefreshToken(refreshToken: string): Promise<UserEntity | null> {
        let found = await this.repository.findOne({ where: { refreshToken : { $all: [refreshToken]} } });
        return found;
    }

    /**
     * Craate new user
     * @param {UserEntity} user
     */
    public async create(username: string, password: string) { 
        let entity = this.repository.create({
            username: username,
            role: 2001,
            password: bcrypt.hashSync(password, 5),
            refreshToken: []
        });

        return await this.repository.save(entity);
    }

    /**
     * Update user
     * @param {IuserEntity} user
     */
     public async update(user: IUserEntity) {
        let found = await this.repository.findOne({where: { username: user.username }})
        let entity = this.repository.create(user);
        if (found) {
            entity.id = found.id;
        }
        return await this.repository.save(entity);
    }
}
