import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity, SequentialId } from '../../common/common.types';
import { User } from './user';
import { Role } from "../../feautures/auth/domain/auth.domain.types";

@Entity('user_roles')
export class UserRole extends BaseEntity {

    id!: SequentialId;

    createdAt!: Date;

    updatedAt!: Date;

    @Column('text')
    role!: Role

    @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user!: User
}