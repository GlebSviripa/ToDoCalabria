import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AnySchema, CustomValidator } from 'joi';
import * as joi from 'joi';
import { errorValidation } from "./common.errors";


export class JoiValidationPipe<I, O> implements PipeTransform<I, O> {
    constructor(private schema: AnySchema<O>) {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(input: I, metadata: ArgumentMetadata): O {
        const { value, error } = this.schema.validate(input);
        if (error) throw errorValidation(error.message);
        return value;
    }

}

export function pipeValidate<I, O>(schema: AnySchema<O>): PipeTransform<I, O> {
    return new JoiValidationPipe(schema);
}

export function joiStringEnum(options: readonly string[], required = true): joi.StringSchema {
    let result = joi.string().valid(...options);
    if (required) result = result.required();
    return result;
}

export function joiCommaNumbers(): CustomValidator {
    return (value: string, helpers) => {
        const numbers = value.split(',').filter(s => s.length > 0).map((s) => parseInt(s));
        if (numbers.findIndex((v) => isNaN(v)) >= 0) {
            return helpers.error('any.invalid');
        }
        return numbers;
    };
}

export function joiCommaStrings(allowed: readonly string[]): CustomValidator {
    return (value: string) => {
        const strings = value.split(',').map((s) => s.trim());

        for (const s of strings) {
            if (allowed.indexOf(s) < 0) throw new Error(`only [${allowed.join()}] values are allowed`);
        }
        return strings;
    };
}