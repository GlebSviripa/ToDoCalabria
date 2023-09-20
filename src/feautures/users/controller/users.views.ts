import { AsyncViewer } from "../../../common/common.viewer";
import { User } from "../../../database/entities/user";
import { ApiProperty } from "@nestjs/swagger";
import { Role, RoleOptions } from "../../auth/domain/auth.domain.types";
import { UsersSendInviteOutput } from "../domain/user.domain.types";
import { ConfigService } from "@nestjs/config";


export abstract class UserView {
    @ApiProperty({ type: 'string' })
    abstract id: string;
    @ApiProperty({ type: 'string' })
    abstract email: string;
    @ApiProperty({ type: 'string' })
    abstract firstName: string;
    @ApiProperty({ type: 'string' })
    abstract lastName: string;
    @ApiProperty({ type: 'string' })
    abstract status: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    abstract createdAt: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    abstract updatedAt: string;
    @ApiProperty({ type: 'array', enum: RoleOptions })
    abstract roles: Role[]
}

export type UserViewer = AsyncViewer<User, UserView>

export function useUserViewer(config: ConfigService): UserViewer {
    return {
        async view(items): Promise<UserView[]> {
            return items.map((u, i) => {
                return {
                    id: u.uuid,
                    email: u.email,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    status: u.status,
                    createdAt: u.createdAt.toISOString(),
                    updatedAt: u.updatedAt.toISOString(),
                    roles: u.roles.map(r => r.role)
                };
            });
        },
    };
}

export abstract class UserInviteView extends UserView{
    @ApiProperty({ type: 'string' })
    abstract invitationCode: string;
}

export type UserInviteViewer = AsyncViewer<UsersSendInviteOutput, UserInviteView>

export function useUserInviteViewer(config: ConfigService): UserInviteViewer {
    return {
        async view(items): Promise<UserInviteView[]> {
            const userViews = await useUserViewer(config).view(items)
            return items.map((u, i) => {
                return {
                    ...userViews[i],
                    invitationCode: u.invitationCode
                };
            });
        },
    };
}

export type UserPublicViewer = AsyncViewer<User, UserPublicView>
export abstract class UserPublicView {
    @ApiProperty({ type: 'string' })
    abstract id: string;
    @ApiProperty({ type: 'string' })
    abstract firstName: string;
    @ApiProperty({ type: 'string' })
    abstract lastName: string;
}

export function useUserPublicViewer(config: ConfigService): UserPublicViewer {
    return {
        async view(items): Promise<UserPublicView[]> {
            return items.map((u, i) => {
                return {
                    id: u.uuid,
                    firstName: u.firstName,
                    lastName: u.lastName,
                };
            });
        },
    };
}