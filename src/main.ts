import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import "reflect-metadata"
import { AppModule } from './app.module';
import { errorCodesDescriptions } from './app.docs';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { getValueFromConfig } from "./common/common.utils";
import { ConfigService } from "@nestjs/config";
import { RequestsErrorFilter } from "./common/common.errors";
import { getLogger, LoggerFormat, LoggerLevel } from "./feautures/logger/logger";
import { WinstonLoggerService } from "./feautures/logger/LoggerService";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService)

    const loggerLevel = getValueFromConfig<LoggerLevel>(config, 'LOGGER_LEVEL')
    const loggerFormat = getValueFromConfig<LoggerFormat>(config, 'LOGGER_FORMAT')
    const logger = getLogger({level: loggerLevel, format: loggerFormat})
    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useLogger(new WinstonLoggerService(logger));
    app.useGlobalFilters(new RequestsErrorFilter(httpAdapterHost, logger));

    const appConfig = new DocumentBuilder()
        .setTitle('TODO Calabria App API')
        .setDescription('TODO Calabria App API description \n\n' + errorCodesDescriptions())
        .setVersion('1.0')
        .addTag('TODO Calabria')
        .addOAuth2({
            type: 'oauth2',
            flows: {
                password: {
                    tokenUrl: '/auth/token',
                    refreshUrl: '/token/refresh',
                    scopes: {}
                }
            }
        })
        .build();

    const document = SwaggerModule.createDocument(app, appConfig);
    SwaggerModule.setup('docs', app, document);

    const port = getValueFromConfig<number>(config,'APP_PORT')

    app.enableCors({
        allowedHeaders: '*',
        origin: [
            "*",
        ],
        methods: '*',
        exposedHeaders: '*',
    });

    await app.listen(port).then(
        () => {
            logger.info(`😸 Started on: ${port}`)
        }
    );
}

bootstrap();
