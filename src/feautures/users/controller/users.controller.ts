import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { UserInviteView, UserView, useUserViewer } from "./users.views";
import { UserAuth } from "../../auth/auth.user.decorator";
import { pipeValidate } from "../../../common/common.validation";
import * as joi from "joi";
import { EntityId } from "../../../common/common.types";
import { Auth } from "../../auth/controller/auth.controller.types";
import { UsersProfileGetUseCase } from "../domain/users.profile.get.usecase";
import { UserCreateBody, UserSearchQuery, UserSendInviteBody, UserUpdateBody } from "./users.controller.types";
import { userSearchSchema, userUpdateInputSchema } from "./users.controller.validation";
import { UsersProfileUpdateUseCase } from "../domain/users.profile.update.usecase";
import { errorNotFound } from "../../../common/common.errors";
import { ConfigService } from "@nestjs/config";
import { UsersDeleteUseCase } from "../domain/user.delete.usecase";
import { UsersGetListUseCase } from "../domain/users.get.list.usecase";

@ApiExtraModels(
    UserView,
    UserUpdateBody,
    UserInviteView,
    UserCreateBody,
    UserSendInviteBody
)
@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(
        private readonly config: ConfigService,
        private readonly profileGetUseCase: UsersProfileGetUseCase,
        private readonly profileUpdateUseCase: UsersProfileUpdateUseCase,
        private readonly userGetListUseCase: UsersGetListUseCase,
        private readonly userDeleteUseCase: UsersDeleteUseCase,
    ) {
    }

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        schema: { type: 'array', items: { $ref: getSchemaPath(UserView) } }
    })
    @ApiOperation({ operationId: 'users-me', description: 'Get current user' })
    async list(
        @UserAuth() auth: Auth,
        @Query(pipeValidate(userSearchSchema)) query: UserSearchQuery,
    ): Promise<UserView[]> {
        const result = await this.userGetListUseCase.execute({ auth: auth, status: query.status  })
        return await useUserViewer(this.config).view(result)
    }

    @Get('/me')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        schema: { $ref: getSchemaPath(UserView) },
    })
    @ApiOperation({ operationId: 'users-me', description: 'Get current user' })
    async myProfile(
        @UserAuth() auth: Auth,
    ): Promise<UserView> {
        if (auth.user == null) throw errorNotFound(`User is anonymous. User`)
        const result = await this.profileGetUseCase.execute({ auth: auth, uuid: auth.user.uuid })
        const [view] = await useUserViewer(this.config).view([result])
        return view
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        schema: { $ref: getSchemaPath(UserView) },
    })
    @ApiOperation({ operationId: 'users-id', description: 'Get user by id' })
    async profile(
        @UserAuth() auth: Auth,
        @Param('id', pipeValidate(joi.string().required())) id: EntityId,
    ): Promise<UserView> {
        const result = await this.profileGetUseCase.execute({ auth: auth, uuid: id })
        const [view] = await useUserViewer(this.config).view([result])
        return view
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        schema: { $ref: getSchemaPath(UserView) },
    })
    @ApiOperation({ operationId: 'users-update', description: 'Update user' })
    async updateProfile(
        @UserAuth() auth: Auth,
        @Param('id', pipeValidate(joi.string().required())) id: EntityId,
        @Body(pipeValidate(userUpdateInputSchema)) body: UserUpdateBody,
    ): Promise<UserView> {
        const result = await this.profileUpdateUseCase.execute({
            auth: auth,
            uuid: id,
            firstName: body.firstName,
            lastName: body.lastName,
            pictureId: body.picture,
        })
        const [view] = await useUserViewer(this.config).view([result])
        return view
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse()
    @ApiOperation({ operationId: 'users-delete', description: 'Delete user by id' })
    async deleteProfile(
        @UserAuth() auth: Auth,
        @Param('id', pipeValidate(joi.string().required())) id: EntityId,
    ): Promise<void> {
        await this.userDeleteUseCase.execute({ auth: auth, uuid: id })
        return
    }
}