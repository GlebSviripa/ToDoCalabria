import { CommonUseCase } from "../../../common/common.usecase";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { User } from "../../../database/entities/user";
import { errorUnauthorized } from "../../../common/common.errors";
import { NoteCreateInput, NoteCreateOutput } from "./note.domain.types";
import { Note } from "../../../database/entities/note";

export class NotesCreateUseCase implements CommonUseCase<NoteCreateInput, NoteCreateOutput> {
    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Note)
        private noteRepository: Repository<Note>,
    ) {
    }

    async execute(input: NoteCreateInput): Promise<NoteCreateOutput> {
        if(input.auth.user == null) throw errorUnauthorized()
        const note = this.noteRepository.create({
            status: 'active',
            user: input.auth.user,
            text: input.text,
        })
        await this.noteRepository.save(note)
        return note
    }
}