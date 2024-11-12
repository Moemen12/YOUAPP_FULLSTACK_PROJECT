import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { HeaderData } from "../types/index";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): HeaderData => {
    const req = ctx.switchToHttp().getRequest();
    return req.user_info;
  }
);
