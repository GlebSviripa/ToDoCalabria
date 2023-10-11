import * as joi from "joi";
import { joiCommaStrings } from "../../../common/common.validation";
import { NoteStatusOptions } from "../domain/note.domain.types";
import { NoteCreateBody, NoteSearchQuery, NoteUpdateBody } from "./notes.controller.types";

export const noteSearchSchema = joi.object<NoteSearchQuery>({
    status: joi.string().allow('').custom(joiCommaStrings([...NoteStatusOptions])).default(['active']),
});

export const noteCreateInputSchema = joi.object<NoteCreateBody>({
    text: joi.string().required().allow('')
});

export const noteUpdateInputSchema = joi.object<NoteUpdateBody>({
    text: joi.string().required().allow(''),
    status: joi.string().valid(...Object.values(NoteStatusOptions)),
})