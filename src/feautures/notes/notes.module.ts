import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../../database/entities/user";
import { Note } from "../../database/entities/note";
import { NotesController } from "./controller/notes.controller";
import { NotesGetListUseCase } from "./domain/notes.get.list.usecase";
import { NotesCreateUseCase } from "./domain/notes.create.usecase";
import { NotesUpdateUseCase } from "./domain/notes.update.usecase";

@Module({
    imports: [TypeOrmModule.forFeature([User, Note]), ],
    exports: [TypeOrmModule],
    controllers: [NotesController],
    providers: [
        NotesGetListUseCase,
        NotesCreateUseCase,
        NotesUpdateUseCase,
    ],
})
export class NotesModule {}