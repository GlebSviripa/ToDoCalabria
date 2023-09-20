import { CommonUseCase } from "../../../common/common.usecase";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersProfileGetInput, UsersProfileGetOutput } from "./user.domain.types";
import { User } from "../../../database/entities/user";
import { UserRole } from "../../../database/entities/user_roles";
import { errorNotFound } from "../../../common/common.errors";
import { checkUserAdmin, checkUserSelf } from "../../auth/auth.checks";

export class UsersProfileGetUseCase implements CommonUseCase<UsersProfileGetInput, UsersProfileGetOutput> {
    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
    ) {
    }

    async execute(input: UsersProfileGetInput): Promise<UsersProfileGetOutput> {
        if (!checkUserAdmin(input.auth) && !checkUserSelf(input.auth, input.uuid)) throw errorNotFound(`User: ${ input.uuid }`)

        const user = await this.userRepository.findOne({
            where: {
                uuid: input.uuid
            },
            relations: {
                roles: true,
            }
        })
        if (user == null) throw errorNotFound(`User: ${ input.uuid }`)

        return user
    }
}