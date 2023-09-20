import { Auth } from "../../auth/controller/auth.controller.types";
import { EntityId, Optional, OptionalSequentialId, SequentialId } from "../../../common/common.types";
import { User } from "../../../database/entities/user";
import { Role } from "../../auth/domain/auth.domain.types";

export type UsersProfileGetInput = {
    auth: Auth,
    uuid: EntityId
}

export type UsersProfileGetOutput = User

export type UsersProfileUpdateInput = {
    auth: Auth,
    uuid: EntityId,
    firstName: string,
    lastName: string,
    pictureId: OptionalSequentialId,
}

export type UsersProfileUpdateOutput = User

export const UserStatusOptions = [
    'pending',
    'active',
    'deleted'
] as const

export type UserStatus = (typeof UserStatusOptions)[number]

export type UsersCreateInput = {
    auth: Auth,
    email: string,
    firstName: string,
    lastName: string,
    podcastName: Optional<string>,
    podcastUrl: Optional<string>,
    roles: Role[]
}

export type UsersCreateOutput = User

export type UsersSendInviteInput = {
    auth: Auth,
    email: string
}

export type UsersSendInviteOutput = User & {
    invitationCode: string
}

export type UsersDeleteInput = {
    auth: Auth,
    uuid: EntityId
}

export type UsersDeleteOutput = void


export type UsersGetListInput = {
    auth: Auth,
    status: UserStatus[]
}

export type UsersGetListOutput = User[]