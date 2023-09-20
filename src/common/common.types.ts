import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type EntityId = string
export type Optional<T> = T | null
export type OptionalId = Optional<EntityId>

export type SequentialId = number
export type OptionalSequentialId = Optional<SequentialId>

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('increment')
    abstract id: SequentialId;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    abstract createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    abstract updatedAt: Date;
}