import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth } from "./controller/auth.controller.types";

export const UserAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Auth => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
