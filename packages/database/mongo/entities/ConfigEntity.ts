import { Entity, ObjectId, ObjectIdColumn, Column, Index } from "typeorm";

@Entity()
export class ConfigEntity {

    @ObjectIdColumn()
    id: ObjectId;

    @Index({ unique: true })
    @Column()
    key: string;

    @Column()
    value: string | number;
}
