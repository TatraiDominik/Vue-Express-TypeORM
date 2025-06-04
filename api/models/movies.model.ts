import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Producer } from "./producers.model";

@Entity()
export class Movies {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    madeIn!: string;

    @ManyToOne(() => Producer)
    producer!: Producer;

    @Column()
    cost!: number;
}
