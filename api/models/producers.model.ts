import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Movies } from "./movies.model";

@Entity()
export class Producer {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    bornIn!: string;

    @Column()
    moviesCount!: number;

}
