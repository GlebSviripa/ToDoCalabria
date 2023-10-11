import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DBConfigService } from "./common/common.database";
import { HealthModule } from "./feautures/health/health.module";
import { AuthModule } from "./feautures/auth/auth.module";
import { UsersModule } from "./feautures/users/users.module";
import { JwtAuthGuard } from "./feautures/auth/auth.jwt.guard";
import { NotesModule } from "./feautures/notes/notes.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
            load: []
        }),
        TypeOrmModule.forRootAsync({
            useClass: DBConfigService,
            inject: [DBConfigService]
        }),
        HealthModule,
        AuthModule,
        UsersModule,
        NotesModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {
}
