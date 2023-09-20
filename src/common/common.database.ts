import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { ConfigService } from "@nestjs/config";
import { getValueFromConfig } from "./common.utils";
import { User } from "../database/entities/user";
import { UserSession } from "../database/entities/user_session";
import { UserCode } from "../database/entities/user_codes";
import { UserRole } from "../database/entities/user_roles";

@Injectable()
export class DBConfigService implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: getValueFromConfig<string>(this.configService, 'TODO_CALABRIA_DB_HOST'),
            port: getValueFromConfig<number>(this.configService, 'TODO_CALABRIA_DB_PORT'),
            username: getValueFromConfig<string>(this.configService, 'TODO_CALABRIA_DB_USERNAME'),
            password: getValueFromConfig<string>(this.configService, 'TODO_CALABRIA_DB_PASSWORD'),
            database: getValueFromConfig<string>(this.configService, 'TODO_CALABRIA_DB_NAME'),
            migrations: ['src/migrations/*.ts'],
            entities: [User, UserSession, UserCode, UserRole, ],
            synchronize: false,
            logging: true,
            ssl:
                this.configService.get('POSTGRES_SSL') === 'true'
                    ? { rejectUnauthorized: false }
                    : false,
        };
    }
}