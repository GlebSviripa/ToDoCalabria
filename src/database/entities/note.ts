import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity, SequentialId } from "../../common/common.types";
import { User } from "./user";
import { NoteStatus } from "../../feautures/notes/domain/note.domain.types";

@Entity('notes')
export class Note extends BaseEntity {
    id!: SequentialId;
    createdAt!: Date;
    updatedAt!: Date;
    @Column({ name: 'text', type: 'text' })
    text!: string;
    @Column({ name: 'status', type: 'text' })
    status!: NoteStatus;
    @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user!: User
}