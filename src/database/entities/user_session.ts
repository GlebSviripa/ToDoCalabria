import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity, SequentialId } from '../../common/common.types';
import { User } from './user';

@Entity('user_sessions')
export class UserSession extends BaseEntity {

    id!: SequentialId;

    createdAt!: Date;

    updatedAt!: Date;

    @Column({ name: 'refresh_token', type: 'text' })
    refreshToken!: string

    @ManyToOne(() => User, (user) => user.codes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user!: User

    @Column({ name: 'is_active', type: 'boolean' })
    isActive!: boolean
}