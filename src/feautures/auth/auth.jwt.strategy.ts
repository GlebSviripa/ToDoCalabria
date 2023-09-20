import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from "./domain/auth.domain.types";
import { ConfigService } from "@nestjs/config";
import { getValueFromConfig } from "../../common/common.utils";
import { Auth } from "./controller/auth.controller.types";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../database/entities/user";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: getValueFromConfig<string>(config, 'TODO_CALABRIA_JWT_SECRET'),
        });
    }

    async validate(payload: JWTPayload): Promise<Auth> {
        const user =  await this.userRepository.findOne({
            where: {
                uuid: payload.uid,
                status: 'active'
            },
            relations: {
                roles: true
            }
        })
        return {
            user: user,
            userRoles: user != null ? user.roles.map(r => r.role) : ['user']
        }
    }
}
