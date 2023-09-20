import { AuthOutput, JWTPayload, Role } from "./auth.domain.types";
import { getValueFromConfig } from "../../../common/common.utils";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { User } from "../../../database/entities/user";
import { string } from "joi";
import { v4 as uuidv4 } from 'uuid';
import { Optional } from "../../../common/common.types";

export function jwtSign(secret: string, payload: JWTPayload): string {
    return jwt.sign(
        payload,
        secret,
    );
}

export function jwtGetPayload(token: string): JWTPayload | null {
    const payload = jwt.decode(token)
    return parsePayload(payload)
}

export function jwtVerify(config: ConfigService, token: string): JWTPayload | null {
    const secret = getValueFromConfig<string>(config, 'TODO_CALABRIA_JWT_SECRET')
    try {
        const payload = jwt.verify(token, secret)
        return parsePayload(payload)
    } catch (e) {
        return null
    }
}

function parsePayload(payload: string | jwt.JwtPayload | null): JWTPayload | null {
    if (payload == null || typeof payload == 'string') return null
    if (!payload.sub || !payload.exp || !payload.iat || !payload.uid || !payload.roles) return null
    return {
        sub: payload.sub,
        exp: payload.exp,
        iat: payload.iat,
        uid: payload.uid,
        roles: payload.roles,
        original_uid: payload.original_uid
    }
}

export function prepareAuthOutput(config: ConfigService, user: User, roles: Role[], originalUser: Optional<User> = null): AuthOutput {
    const payload = {
        uid: user.uuid,
        sub: user.email,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + getValueFromConfig<number>(config, ('TODO_CALABRIA_JWT_EXP_HOURS')) * 3600,
        roles: roles,
        original_uid: originalUser == null ? user.uuid : originalUser.uuid
    }

    const refreshPayload = {
        uid: user.uuid,
        sub: user.email,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + getValueFromConfig<number>(config, ('TODO_CALABRIA_JWT_EXP_HOURS')) * 3600 * 24 * 7, // hours * 7 days
        roles: roles,
        original_uid: originalUser == null ? user.uuid : originalUser.uuid
    }

    const secret = getValueFromConfig<string>(config, 'TODO_CALABRIA_JWT_SECRET')
    const token = jwtSign(secret, payload)
    const refreshToken = jwtSign(uuidv4(), refreshPayload)
    return {
        accessToken: token,
        refreshToken: refreshToken,
        user: user
    }
}