import { ApiProperty } from "@nestjs/swagger";
import { NoteStatus, NoteStatusOptions } from "../domain/note.domain.types";

export abstract class NoteSearchQuery {
    @ApiProperty({
        type: 'string',
        description: 'List of comma-separated values',
        example: NoteStatusOptions.join(),
        required: false,
    })
    abstract status: NoteStatus[];
}

export abstract class NoteCreateBody {
    @ApiProperty({ type: 'string', required: true })
    abstract text: string;
}

export abstract class NoteUpdateBody {
    @ApiProperty({ type: 'string', required: true })
    abstract text: string;
    @ApiProperty({ type: 'string', required: true })
    abstract status: NoteStatus;
}