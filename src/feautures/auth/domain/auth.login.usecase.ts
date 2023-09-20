import { CommonUseCase } from "../../../common/common.usecase";
import { AuthLoginInput, AuthOutput } from "./auth.domain.types";
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { errorUnauthorized } from "../../../common/common.errors";
import { ConfigService } from "@nestjs/config";
import { prepareAuthOutput } from "./auth.domain.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../../database/entities/user";
import { Repository } from "typeorm";
import { UserSession } from "../../../database/entities/user_session";

@Injectable()
export class AuthLoginUseCase implements CommonUseCase<AuthLoginInput, AuthOutput> {

    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserSession)
        private userSessionRepository: Repository<UserSession>,
    ) {
    }

    async execute(input: AuthLoginInput): Promise<AuthOutput> {
        const user = await this.userRepository.findOne({
            where: {
                email: input.email
            },
            relations: {
                roles: true
            }
        })
        if (user == null || user.password == null || user.status !== 'active' || !(await bcrypt.compare(input.password, user.password))) {
            throw errorUnauthorized();
        }
        const roles = user.roles.map(r => r.role)
        const output =  prepareAuthOutput(this.config, user, roles)
        const session = this.userSessionRepository.create({
            user: user,
            refreshToken: output.refreshToken,
            isActive: true
        })
        await this.userSessionRepository.save(session)
        return output
    }

}