import { LogLevel } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';
import winston from "winston";


export class WinstonLoggerService implements LoggerService {

    constructor(readonly logger: winston.Logger) {
    }

    log(message: string, ...optionalParams: string[]) {
        this.logger.verbose(message, ...optionalParams);
    }

    debug(message: string, ...optionalParams: string[]) {
        this.logger.debug(message, ...optionalParams);
    }

    error(message: string, ...optionalParams: string[]) {
        this.logger.error(message, ...optionalParams);
    }

    setLogLevels(levels: LogLevel[]) {
        this.logger.warning(`Levels change is requested, but not implemented: ${levels}`);
    }

    verbose(message: string, ...optionalParams: string[]) {
        this.logger.verbose(message, ...optionalParams);
    }

    warn(message: string, ...optionalParams: string[]) {
        this.logger.warning(message, ...optionalParams);
    }

}
