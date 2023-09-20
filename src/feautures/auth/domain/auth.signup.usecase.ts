import { CommonUseCase } from "../../../common/common.usecase";
import { AuthOutput, AuthSignupInput } from "./auth.domain.types";
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";
import { prepareAuthOutput } from "./auth.domain.utils";
import { User } from "../../../database/entities/user";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSession } from "../../../database/entities/user_session";
import { errorConflict } from "../../../common/common.errors";
import { UserRole } from "../../../database/entities/user_roles";

@Injectable()
export class AuthSignupUseCase implements CommonUseCase<AuthSignupInput, AuthOutput> {

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

    async execute(input: AuthSignupInput): Promise<AuthOutput> {
        const password = await bcrypt.hash(input.password, 10)
        const existedUser = await this.userRepository.findOne({where: {email: input.email}})
        if(existedUser != null) throw errorConflict('Can\'t create user with this email')
        const user: User = this.userRepository.create({
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            password: password,
            status: 'active',
        })
        await this.userRepository.save(user)
        const userRole = this.userRoleRepository.create({
            role: 'user',
            user: user,
        })
        await this.userRoleRepository.save(userRole)

        const output = prepareAuthOutput(this.config, user, [userRole.role])
        const session = this.userSessionRepository.create({
            user: user,
            refreshToken: output.refreshToken,
            isActive: true
        })
        await this.userSessionRepository.save(session)
        return output
    }

}