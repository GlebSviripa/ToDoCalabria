import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import {
    ApiCreatedResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    getSchemaPath
} from "@nestjs/swagger";
import { AuthLoginUseCase } from "../domain/auth.login.usecase";
import {
    Auth,
    AuthImpersonateUserBody,
    AuthLoginInputBody,
    AuthRefreshTokenBody,
    AuthResetPasswordBody,
    AuthResetPasswordConfirmBody,
    AuthSignupInputBody,
    AuthSignupInviteInputBody,
} from "./auth.controller.types";
import { pipeValidate } from "../../../common/common.validation";
import {
    authImpersonateUserInputSchema,
    authLoginInputSchema,
    authRefreshTokenInputSchema,
    authSignupInputSchema,
    authSignupInviteInputSchema
} from "./auth.controller.validation";
import { AuthSignupUseCase } from "../domain/auth.signup.usecase";
import { AuthView, useAuthTokenViewer } from "./auth.views";
import { AuthRefreshTokenUseCase } from "../domain/auth.refresh.token.usecase";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { Public } from "../auth.public.decorator";
import { UserAuth } from "../auth.user.decorator";
import { AuthImpersonateUserUseCase } from "../domain/auth.impersonate.user.usecase";

@ApiExtraModels(
    AuthView,
    AuthLoginInputBody,
    AuthSignupInputBody,
    AuthSignupInviteInputBody,
    AuthRefreshTokenBody,
    AuthResetPasswordBody,
    AuthResetPasswordConfirmBody,
    AuthImpersonateUserBody
)
@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly loginUseCase: AuthLoginUseCase,
        private readonly signupUseCase: AuthSignupUseCase,
        private readonly refreshTokenUseCase: AuthRefreshTokenUseCase,
        private readonly impersonateUserUseCase: AuthImpersonateUserUseCase,
    ) {
    }

    @Post('/token')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        schema: { $ref: getSchemaPath(AuthView) },
    })
    @ApiOperation({ operationId: 'auth-token', description: 'Get access token' })
    @Public()
    async login(
        @Body(pipeValidate(authLoginInputSchema)) body: AuthLoginInputBody,
    ): Promise<AuthView> {
        const result = await this.loginUseCase.execute({ email: body.username, password: body.password })
        const [view] = await useAuthTokenViewer().view([result])
        return view
    }


    @Post('/signup')
    @ApiCreatedResponse({
        schema: { $ref: getSchemaPath(AuthView) },
    })
    @ApiOperation({ operationId: 'auth-signup', description: 'Signup new user' })
    @Public()
    async signup(
        @Body(pipeValidate(authSignupInputSchema)) body: AuthSignupInputBody,
    ): Promise<AuthView> {
        const result = await this.signupUseCase.execute(body)
        const [view] = await useAuthTokenViewer().view([result])
        return view
    }

    @Post('/token/refresh')
    @ApiOkResponse({
        schema: { $ref: getSchemaPath(AuthView) },
    })
    @ApiOperation({ operationId: 'auth-refresh', description: 'Get new access token with refresh token' })
    @Public()
    async refresh(
        @Body(pipeValidate(authRefreshTokenInputSchema)) body: AuthRefreshTokenBody,
    ): Promise<AuthView> {
        const result = await this.refreshTokenUseCase.execute(body)
        const [view] = await useAuthTokenViewer().view([result])
        return view
    }

    @Post('/impersonate')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse()
    @ApiOperation({ operationId: 'auth-impersonate-user', description: 'Get impersonate token' })
    async impersonateUser(
        @UserAuth() auth: Auth,
        @Body(pipeValidate(authImpersonateUserInputSchema)) body: AuthImpersonateUserBody,
    ): Promise<AuthView> {
        const result = await this.impersonateUserUseCase.execute({userId: body.userId, auth: auth})
        const [view] = await useAuthTokenViewer().view([result])
        return view
    }


}