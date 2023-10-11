import { Auth } from "../../auth/controller/auth.controller.types";
import { Note } from "../../../database/entities/note";
import { SequentialId } from "../../../common/common.types";


export const NoteStatusOptions = [
    'active',
    'done'
] as const

export type NoteStatus = (typeof NoteStatusOptions)[number]

export type NotesGetListInput = {
    auth: Auth,
    status: NoteStatus[]
}

export type NotesGetListOutput = Note[]

export type NoteCreateInput = {
    auth: Auth,
    text: string,
}

export type NoteCreateOutput = Note

export type NoteUpdateInput = {
    auth: Auth,
    id: SequentialId,
    text: string,
    status: NoteStatus,
}

export type NoteUpdateOutput = Note