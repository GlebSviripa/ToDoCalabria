import {
    AuthImpersonateUserBody,
    AuthLoginInputBody,
    AuthRefreshTokenBody, AuthResetPasswordBody, AuthResetPasswordConfirmBody,
    AuthSignupInputBody,
    AuthSignupInviteInputBody
} from "./auth.controller.types";
import * as joi from 'joi';

export const authLoginInputSchema = joi.object<AuthLoginInputBody>({
    username: joi.string().email().required().lowercase().trim(),
    password: joi.string().required(),
    grant_type: joi.string().optional(),
});

export const authSignupInputSchema = joi.object<AuthSignupInputBody>({
    email: joi.string().email().required().lowercase().trim(),
    password: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
});

export const authSignupInviteInputSchema = joi.object<AuthSignupInviteInputBody>({
    password: joi.string().required(),
    registrationCode: joi.string().uuid({ version: 'uuidv4' }).required()
});

export const authRefreshTokenInputSchema = joi.object<AuthRefreshTokenBody>({
    refreshToken: joi.string().required(),
});

export const authResetPasswordInputSchema = joi.object<AuthResetPasswordBody>({
    email: joi.string().email().required().lowercase().trim(),
});

export const authResetPasswordConfirmInputSchema = joi.object<AuthResetPasswordConfirmBody>({
    password: joi.string().required(),
    code: joi.string().required(),
});

export const authImpersonateUserInputSchema = joi.object<AuthImpersonateUserBody>({
    userId: joi.string().required()
});