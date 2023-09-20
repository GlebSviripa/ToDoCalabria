import { Module } from '@nestjs/common';
import { AuthController } from "./controller/auth.controller";
import { AuthLoginUseCase } from "./domain/auth.login.usecase";
import { AuthSignupUseCase } from "./domain/auth.signup.usecase";
import { UsersModule } from "../users/users.module";
import { AuthRefreshTokenUseCase } from "./domain/auth.refresh.token.usecase";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./auth.jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getValueFromConfig } from "../../common/common.utils";
import { AuthImpersonateUserUseCase } from "./domain/auth.impersonate.user.usecase";

@Module({
    imports: [
        PassportModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule, UsersModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: getValueFromConfig<string>(config, 'TODO_CALABRIA_JWT_SECRET'),
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        AuthLoginUseCase,
        AuthSignupUseCase,
        AuthRefreshTokenUseCase,
        AuthImpersonateUserUseCase,
    ],
})
export class AuthModule {
}