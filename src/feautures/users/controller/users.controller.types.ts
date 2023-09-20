import { ApiProperty } from "@nestjs/swagger";
import { Role, RoleOptions } from "../../auth/domain/auth.domain.types";
import { UserStatus, UserStatusOptions } from "../domain/user.domain.types";

export abstract class UserUpdateBody {
    @ApiProperty({ type: 'string', required: true })
    abstract firstName: string;
    @ApiProperty({ type: 'string', required: true })
    abstract lastName: string;
    @ApiProperty({ type: 'number', required: true, nullable: true })
    abstract picture: number | null;
}

export abstract class UserCreateBody {
    @ApiProperty({ type: 'string', required: true })
    abstract email: string;
    @ApiProperty({ type: 'string', required: true })
    abstract firstName: string;
    @ApiProperty({ type: 'string', required: true })
    abstract lastName: string;
    @ApiProperty({ type: 'string', required: false })
    abstract podcastName: string | null;
    @ApiProperty({ type: 'string', required: false })
    abstract podcastUrl: string | null;
    @ApiProperty({ type: 'array', enum: RoleOptions, required: true })
    abstract roles: Role[]
}

export abstract class UserSendInviteBody {
    @ApiProperty({ type: 'string', required: true })
    abstract email: string;
}

export abstract class UserSearchQuery {
    @ApiProperty({
        type: 'string',
        description: 'List of comma-separated values',
        example: UserStatusOptions.join(),
        required: false,
    })
    abstract status: UserStatus[];
}