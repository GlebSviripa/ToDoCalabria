import { EntityId } from "../../../common/common.types";
import { User } from "../../../database/entities/user";
import { Auth } from "../controller/auth.controller.types";

export type AuthLoginInput = {
    email: string
    password: string
}

export type AuthSignupInput = {
    email: string
    password: string
    firstName: string
    lastName: string
}

export type AuthSignupInviteInput = {
    password: string
    registrationCode: string
}

export type AuthRefreshTokenInput = {
    refreshToken: string
}

export type AuthResetPasswordInput = {
    email: string
}

export type AuthResetPasswordConfirm = {
    code: string,
    password: string
}

export type AuthImpersonateUserInput = {
    auth: Auth,
    userId: EntityId
}


export type AuthOutput = {
    accessToken: string
    refreshToken: string
    user: User
}

export type JWTPayload = {
    uid: EntityId,
    sub: string,
    iat: number,
    exp: number,
    roles: Role[]
    original_uid: EntityId
}

export const RoleOptions = [
    'user',
    'podcaster',
    'admin'
] as const

export type Role = (typeof RoleOptions)[number]

export const CodeTypeOptions = [
    'invitation',
    'password_reset',
] as const

export type CodeType = (typeof CodeTypeOptions)[number]