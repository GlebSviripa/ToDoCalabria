import { ApiProperty } from "@nestjs/swagger";
import { AsyncViewer } from "../../../common/common.viewer";
import { AuthOutput } from "../domain/auth.domain.types";

export abstract class AuthView {
    @ApiProperty({ type: 'string' })
    abstract accessToken: string;
    @ApiProperty({ type: 'string' })
    abstract refreshToken: string;
}

export type AuthTokenViewer = AsyncViewer<AuthOutput, AuthView>

export function useAuthTokenViewer(): AuthTokenViewer {
    return {
        async view(items): Promise<AuthView[]> {
            return items.map((u, i) => {
                return {
                    accessToken: u.accessToken,
                    refreshToken: u.refreshToken,
                };
            });
        }
    }
}