import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { ArgumentsHost, Catch, HttpException, ExceptionFilter } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core';
import winston from "winston";

export enum ApiErrorCode {
    Validation = 'validation',
    Unknown = 'unknown',
    Internal = 'internal',
    Unauthorized = 'unauthorized',
    Forbidden = 'forbidden',
    Conflict = 'conflict',
    NotFound = 'not_exists',
    TooManyRequests = 'too_many_requests'
}

export class ApiError extends Error {

    code: ApiErrorCode;
    status: HttpStatus;
    timestamp: Date;

    constructor(status: number, code: ApiErrorCode, message: string) {
        super(message);
        this.code = code;
        this.status = status;
        this.timestamp = new Date();
    }
}

export function errorValidation(message: string): ApiError {
    return new ApiError(HttpStatus.BAD_REQUEST, ApiErrorCode.Validation, message);
}

export function errorInternalException(error: Error): ApiError {
    const result = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ApiErrorCode.Internal, error.message);
    result.stack = error.stack;
    return result;
}

export function errorInternal(error?: string | Error): ApiError {
    if(typeof error == 'string' || !error)
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ApiErrorCode.Unknown, error || 'Unknown Error');
    const result = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ApiErrorCode.Internal, error.message);
    result.stack = error.stack;
    return result;
}

export function errorUnauthorized(): ApiError {
    return new ApiError(HttpStatus.UNAUTHORIZED, ApiErrorCode.Unauthorized, 'User is not authorized');
}

export function errorForbidden(message?: string): ApiError {
    return new ApiError(HttpStatus.FORBIDDEN, ApiErrorCode.Forbidden, `Access is forbidden. ${message}`);
}

export function errorConflict(message: string): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ApiErrorCode.Conflict, message);
}

export function errorNotFound(entity: string): ApiError {
    return new ApiError(HttpStatus.NOT_FOUND, ApiErrorCode.NotFound, `Entity ${entity} not found`);
}


@Catch()
export class RequestsErrorFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost, private readonly logger: winston.Logger) {
    }

    catch(exception: Error, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        this.logger.error(`${exception.name}: ${exception.message}\n${exception.stack}`)
        if (exception instanceof ApiError) {
            httpAdapter.reply(ctx.getResponse(), apiErrorResponse(this.logger, exception), exception.status);
        } else if(exception instanceof HttpException) {
            httpAdapter.reply(ctx.getResponse(), exception.getResponse(), exception.getStatus());
        }
        else {
            httpAdapter.reply(ctx.getResponse(), apiErrorResponse(this.logger, errorInternal(exception)), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

function apiErrorResponse(logger: winston.Logger, error: ApiError): ApiErrorResponse {
    return {
        code: error.status,
        error: error.code,
        message: error.message,
    }
}

class ApiErrorResponse {
    code: number
    error: ApiErrorCode
    message: string

    constructor(status: number, code: ApiErrorCode, message: string) {
        this.error = code
        this.code = status
        this.message = message
    }

}