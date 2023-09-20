import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../../database/entities/user";
import { UserSession } from "../../database/entities/user_session";
import { UserCode } from "../../database/entities/user_codes";
import { UserRole } from "../../database/entities/user_roles";
import { UsersProfileGetUseCase } from "./domain/users.profile.get.usecase";
import { UsersController } from "./controller/users.controller";
import { UsersProfileUpdateUseCase } from "./domain/users.profile.update.usecase";
import { UsersDeleteUseCase } from "./domain/user.delete.usecase";
import { UsersGetListUseCase } from "./domain/users.get.list.usecase";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserSession, UserCode, UserRole, ]), ],
    exports: [TypeOrmModule],
    controllers: [UsersController],
    providers: [
        UsersProfileGetUseCase,
        UsersProfileUpdateUseCase,
        UsersDeleteUseCase,
        UsersGetListUseCase
    ],
})
export class UsersModule {}