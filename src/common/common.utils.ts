import { ConfigService } from "@nestjs/config";
import { errorInternal } from "./common.errors";

export function getValueFromConfig<T>(config: ConfigService, key: string): T {
    const value = config.get<T>(key)
    if (!value) {
        throw errorInternal(`Env ${ key } is missing`)
    }
    return value;
}
