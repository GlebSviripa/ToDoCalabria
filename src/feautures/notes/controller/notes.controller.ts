import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { Body, Controller, Get, HttpCode, Param, Post, Put, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { UserAuth } from "../../auth/auth.user.decorator";
import { Auth } from "../../auth/controller/auth.controller.types";
import { pipeValidate } from "../../../common/common.validation";
import { NoteView, useNotePublicViewer } from "./notes.views";
import { NotesGetListUseCase } from "../domain/notes.get.list.usecase";
import { NoteCreateBody, NoteSearchQuery, NoteUpdateBody } from "./notes.controller.types";
import { noteCreateInputSchema, noteSearchSchema, noteUpdateInputSchema } from "./notes.controller.validation";
import { NotesCreateUseCase } from "../domain/notes.create.usecase";
import { SequentialId } from "../../../common/common.types";
import * as joi from "joi";
import { NotesUpdateUseCase } from "../domain/notes.update.usecase";

@ApiTags('notes')
@Controller('notes')
export class NotesController {

    constructor(
        private readonly config: ConfigService,
        private readonly notesGetListUseCase: NotesGetListUseCase,
        private readonly notesCreateUseCase: NotesCreateUseCase,
        private readonly notesUpdateUseCase: NotesUpdateUseCase,
    ) {
    }

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        schema: { type: 'array', items: { $ref: getSchemaPath(NoteView) } }
    })
    @ApiOperation({ operationId: 'notes', description: 'Get notes' })
    async list(
        @UserAuth() auth: Auth,
        @Query(pipeValidate(noteSearchSchema)) query: NoteSearchQuery,
    ): Promise<NoteView[]> {
        const result = await this.notesGetListUseCase.execute({ auth: auth, status: query.status })
        return await useNotePublicViewer(this.config).view(result)
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        schema: { $ref: getSchemaPath(NoteView) },
    })
    @ApiOperation({ operationId: 'notes-create', description: 'Create note' })
    async createUser(
        @UserAuth() auth: Auth,
        @Body(pipeValidate(noteCreateInputSchema)) body: NoteCreateBody,
    ): Promise<NoteView> {
        const result = await this.notesCreateUseCase.execute({
            auth: auth,
            text: body.text
        })
        const [view] = await useNotePublicViewer(this.config).view([result])
        return view
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        schema: { $ref: getSchemaPath(NoteView) },
    })
    @ApiOperation({ operationId: 'notes-update', description: 'Update note' })
    async updateSubscription(
        @UserAuth() auth: Auth,
        @Param('id', pipeValidate(joi.number().required())) id: SequentialId,
        @Body(pipeValidate(noteUpdateInputSchema)) body: NoteUpdateBody,
    ): Promise<NoteView> {
        const result = await this.notesUpdateUseCase.execute({
            auth: auth,
            id: id,
            text: body.text,
            status: body.status

        })
        const [view] = await useNotePublicViewer(this.config).view([result])
        return view
    }

}