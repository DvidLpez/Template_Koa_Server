import { Entity, ObjectID, ObjectIdColumn, Column, Index } from "typeorm";

@Entity()
export class ConfigEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @Index({ unique: true })
    @Column()
    key: string;

    @Column()
    value: string | number;
}
