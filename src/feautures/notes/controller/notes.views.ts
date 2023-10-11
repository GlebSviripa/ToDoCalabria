import { ApiProperty } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { UserPublicView, UserPublicViewer } from "../../users/controller/users.views";
import { AsyncViewer } from "../../../common/common.viewer";
import { User } from "../../../database/entities/user";
import { Note } from "../../../database/entities/note";

export abstract class NoteView {
    @ApiProperty({ type: 'number' })
    abstract id: number;
    @ApiProperty({ type: 'string' })
    abstract text: string;
    @ApiProperty({ type: 'string' })
    abstract status: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    abstract createdAt: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    abstract updatedAt: string;
}

export type NotePublicViewer = AsyncViewer<Note, NoteView>

export function useNotePublicViewer(config: ConfigService): NotePublicViewer {
    return {
        async view(items): Promise<NoteView[]> {
            return items.map((n, i) => {
                return {
                    id: n.id,
                    text: n.text,
                    status: n.status,
                    createdAt: n.createdAt.toISOString(),
                    updatedAt: n.updatedAt.toISOString(),
                };
            });
        },
    };
}