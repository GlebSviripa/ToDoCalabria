import { CommonUseCase } from "../../../common/common.usecase";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { User } from "../../../database/entities/user";
import { errorUnauthorized } from "../../../common/common.errors";
import { NotesGetListInput, NotesGetListOutput } from "./note.domain.types";
import { Note } from "../../../database/entities/note";

export class NotesGetListUseCase implements CommonUseCase<NotesGetListInput, NotesGetListOutput> {
    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Note)
        private noteRepository: Repository<Note>,
    ) {
    }

    async execute(input: NotesGetListInput): Promise<NotesGetListOutput> {
        if(input.auth.user == null) throw errorUnauthorized()
        return await this.noteRepository.find({
            where: {
                user: {
                    uuid: input.auth.user.uuid
                },
                status: In(input.status)
            }
        })
    }
}