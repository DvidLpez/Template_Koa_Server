import { Entity, ObjectId, ObjectIdColumn, Column, Index } from "typeorm";


export interface IUserEntity{
    username: string;
    role: number;
    password: string;
    refreshToken: string[];
}

@Entity()
export class UserEntity {

    @ObjectIdColumn()
    id: ObjectId;

    @Index({ unique: true })
    @Column()
    username: string;

    @Column()
    role: number;

    @Column()
    password: string;

    @Column()
    // Array multiple devices
    refreshToken: string[];
}
