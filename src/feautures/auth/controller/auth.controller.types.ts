import { ApiProperty } from "@nestjs/swagger";
import { EntityId, SequentialId } from "../../../common/common.types";
import { Role } from "../domain/auth.domain.types";
import { UserRole } from "../../../database/entities/user_roles";
import { User } from "../../../database/entities/user";

export abstract class AuthLoginInputBody {
    @ApiProperty({ type: 'string', required: true })
    abstract username: string;
    @ApiProperty({ type: 'string', required: true })
    abstract password: string;
    @ApiProperty({ type: 'string', required: false })
    abstract grant_type: string;
}

export abstract class AuthSignupInputBody {
    @ApiProperty({ type: 'string', required: true })
    abstract email: string;
    @ApiProperty({ type: 'string', required: true })
    abstract password: string;
    @ApiProperty({ type: 'string', required: true })
    abstract firstName: string;
    @ApiProperty({ type: 'string', required: true })
    abstract lastName: string;
}

export abstract class AuthSignupInviteInputBody {
    @ApiProperty({ type: 'string', required: true })
    abstract password: string;
    @ApiProperty({ type: 'string' })
    abstract registrationCode: string;
}

export abstract class AuthRefreshTokenBody {
    @ApiProperty({ type: 'string', required: true })
    abstract refreshToken: string;
}

export abstract class AuthResetPasswordBody {
    @ApiProperty({ type: 'string', required: true })
    abstract email: string;
}

export abstract class AuthResetPasswordConfirmBody {
    @ApiProperty({ type: 'string', required: true })
    abstract code: string;
    @ApiProperty({ type: 'string', required: true })
    abstract password: string;
}

export abstract class AuthImpersonateUserBody {
    @ApiProperty({ type: 'string', required: true })
    abstract userId: string;
}

export type Auth = {
    user: User | null,
    userRoles: Role[]
}