import { Auth } from "./controller/auth.controller.types";
import { EntityId } from "../../common/common.types";

export function checkUserAdmin(auth: Auth): boolean {
    return auth.user != null && auth.userRoles.includes('admin')
}

export function checkUserSelf(auth: Auth, uuid: EntityId): boolean {
    return auth.user != null && auth.user.uuid == uuid
}