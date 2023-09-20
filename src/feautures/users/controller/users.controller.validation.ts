import * as joi from 'joi';
import { UserCreateBody, UserSearchQuery, UserSendInviteBody, UserUpdateBody } from './users.controller.types';
import { joiCommaStrings, joiStringEnum } from "../../../common/common.validation";
import { RoleOptions } from "../../auth/domain/auth.domain.types";
import { UserStatusOptions } from "../domain/user.domain.types";

export const userUpdateInputSchema = joi.object<UserUpdateBody>({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    picture: joi.number().required().allow(null),
});

export const userCreateInputSchema = joi.object<UserCreateBody>({
    email: joi.string().email().required().lowercase().trim(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    podcastName: joi.string().allow(null).optional().default(null),
    podcastUrl: joi.string().allow(null).optional().default(null),
    roles: joi.array().min(1).items(joiStringEnum(RoleOptions, false)).required(),
});

export const userSendInviteInputSchema = joi.object<UserSendInviteBody>({
    email: joi.string().email().required().lowercase().trim(),
});

export const userSearchSchema = joi.object<UserSearchQuery>({
    status: joi.string().allow('').custom(joiCommaStrings([...UserStatusOptions])).default(['active']),
});