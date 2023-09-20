import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { BaseEntity, SequentialId } from '../../common/common.types';
import { User } from './user';
import { CodeType } from "../../feautures/auth/domain/auth.domain.types";

@Entity('user_codes')
export class UserCode extends BaseEntity {

    id!: SequentialId;

    createdAt!: Date;

    updatedAt!: Date;

    @Column('uuid')
    @Generated("uuid")
    code!: string

    @Column('text')
    codeType!: CodeType

    @Column({ name: 'is_active', type: 'boolean' })
    isActive!: boolean

    @Column({ name: 'expires_at', type: 'timestamptz' })
    expiresAt!: Date;

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user!: User
}