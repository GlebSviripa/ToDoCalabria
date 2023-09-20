import { Column, Entity, Generated, Index, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseEntity, SequentialId } from "../../common/common.types";
import { UserSession } from "./user_session";
import { UserCode } from "./user_codes";
import { UserRole } from "./user_roles";
import { UserStatus } from "../../feautures/users/domain/user.domain.types";

@Entity('users')
@Unique(["email"])
export class User extends BaseEntity {

    id!: SequentialId;

    createdAt!: Date;

    updatedAt!: Date;

    @Column({ name: 'password', type: 'text', nullable: true })
    password!: string | null

    @Index()
    @Column('uuid')
    @Generated("uuid")
    uuid!: string

    @Column({type: 'text', unique: true})
    email!: string

    @Column({ name: 'first_name', type: 'text' })
    firstName!: string

    @Column({ name: 'last_name', type: 'text' })
    lastName!: string

    @Column({ name: 'status', type: 'text' })
    status!: UserStatus

    @OneToMany(() => UserSession, (userSession) => userSession.user)
    sessions!: UserSession[]

    @OneToMany(() => UserCode, (userCode) => userCode.user)
    codes!: UserCode[]

    @OneToMany(() => UserRole, (userRole) => userRole.user)
    roles!: UserRole[]
}