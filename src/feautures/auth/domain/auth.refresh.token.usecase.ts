import { CommonUseCase } from "../../../common/common.usecase";
import { AuthOutput, AuthRefreshTokenInput } from "./auth.domain.types";
import { Injectable } from '@nestjs/common';
import { errorUnauthorized } from "../../../common/common.errors";
import { ConfigService } from "@nestjs/config";
import { jwtGetPayload, prepareAuthOutput } from "./auth.domain.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../../database/entities/user";
import { Repository } from "typeorm";
import { UserSession } from "../../../database/entities/user_session";
import { UserRole } from "../../../database/entities/user_roles";

@Injectable()
export class AuthRefreshTokenUseCase implements CommonUseCase<AuthRefreshTokenInput, AuthOutput> {

    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserSession)
        private userSessionRepository: Repository<UserSession>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
    ) {
    }

    async execute(input: AuthRefreshTokenInput): Promise<AuthOutput> {
        const expSeconds = jwtGetPayload(input.refreshToken)?.exp
        if(expSeconds == null || (expSeconds * 1000) < Date.now()) throw errorUnauthorized()
        const previousSession = await this.userSessionRepository.findOne({
            where: {
                refreshToken: input.refreshToken,
                isActive: true,
            },
            relations: {
                user: true,
            },
        })
        if (previousSession == null || previousSession.user.status !== 'active') {
            throw errorUnauthorized();
        }
        const userRoles = await this.userRoleRepository.find({
            where: {
                user: { id: previousSession.user.id }
            }
        })
        const roles = userRoles.map(r => r.role)
        const output = prepareAuthOutput(this.config, previousSession.user, roles)
        const session = this.userSessionRepository.create({
            user: previousSession.user,
            refreshToken: output.refreshToken,
            isActive: true
        })
        previousSession.isActive = false
        await this.userSessionRepository.save([session, previousSession])
        return output
    }

}