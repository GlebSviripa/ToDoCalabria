import { CommonUseCase } from "../../../common/common.usecase";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersDeleteInput, UsersDeleteOutput } from "./user.domain.types";
import { User } from "../../../database/entities/user";
import { UserRole } from "../../../database/entities/user_roles";
import { errorNotFound } from "../../../common/common.errors";
import { checkUserAdmin } from "../../auth/auth.checks";

export class UsersDeleteUseCase implements CommonUseCase<UsersDeleteInput, UsersDeleteOutput> {
    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
    ) {
    }

    async execute(input: UsersDeleteInput): Promise<UsersDeleteOutput> {
        if (!checkUserAdmin(input.auth)) throw errorNotFound(`User: ${ input.uuid }`)

        const user = await this.userRepository.findOne({
            where: {
                uuid: input.uuid
            }
        })
        if (user == null) throw errorNotFound(`User: ${ input.uuid }`)
        user.status = 'deleted'
        await this.userRepository.save(user)
        return
    }
}