import { CommonUseCase } from "../../../common/common.usecase";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../../database/entities/user";
import { errorNotFound, errorUnauthorized } from "../../../common/common.errors";
import { NoteUpdateInput, NoteUpdateOutput } from "./note.domain.types";
import { Note } from "../../../database/entities/note";

export class NotesUpdateUseCase implements CommonUseCase<NoteUpdateInput, NoteUpdateOutput> {
    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Note)
        private noteRepository: Repository<Note>,
    ) {
    }

    async execute(input: NoteUpdateInput): Promise<NoteUpdateOutput> {
        if(input.auth.user == null) throw errorUnauthorized()
        const note = await this.noteRepository.findOne({
            where: {
                id: input.id
            }
        })
        if(note == null) throw errorNotFound(`Note: ${input.id} not found`)
        note.status = input.status
        note.text = input.text
        await this.noteRepository.save(note)
        return note
    }
}