import { CommonUseCase } from "../../../common/common.usecase";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { UsersGetListInput, UsersGetListOutput } from "./user.domain.types";
import { User } from "../../../database/entities/user";
import { UserRole } from "../../../database/entities/user_roles";
import { errorUnauthorized } from "../../../common/common.errors";
import { checkUserAdmin } from "../../auth/auth.checks";

export class UsersGetListUseCase implements CommonUseCase<UsersGetListInput, UsersGetListOutput> {
    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
    ) {
    }

    async execute(input: UsersGetListInput): Promise<UsersGetListOutput> {
        if (!checkUserAdmin(input.auth)) throw errorUnauthorized()
        return await this.userRepository.find({
            where: {
                status: In(input.status)
            },
            relations: {
                roles: true,
            }
        })
    }
}