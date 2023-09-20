import { CommonUseCase } from "../../../common/common.usecase";
import { AuthImpersonateUserInput, AuthOutput } from "./auth.domain.types";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { prepareAuthOutput } from "./auth.domain.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../../database/entities/user";
import { Repository } from "typeorm";
import { UserSession } from "../../../database/entities/user_session";
import { checkUserAdmin } from "../auth.checks";
import { errorNotFound, errorUnauthorized } from "../../../common/common.errors";

@Injectable()
export class AuthImpersonateUserUseCase implements CommonUseCase<AuthImpersonateUserInput, AuthOutput> {

    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserSession)
        private userSessionRepository: Repository<UserSession>,
    ) {
    }

    async execute(input: AuthImpersonateUserInput): Promise<AuthOutput> {
        if (!checkUserAdmin(input.auth)) throw errorUnauthorized()
        const user = await this.userRepository.findOne({
            where: {
                uuid: input.userId
            },
            relations: {
                roles: true
            }
        })
        if(user == null || user.status !== 'active') throw errorNotFound(`User: ${input.userId}`)

        const roles = user.roles.map(r => r.role)
        const output =  prepareAuthOutput(this.config, user, roles, input.auth.user)
        const session = this.userSessionRepository.create({
            user: user,
            refreshToken: output.refreshToken,
            isActive: true
        })
        await this.userSessionRepository.save(session)
        return output
    }

}