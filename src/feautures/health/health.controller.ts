import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/auth.public.decorator";

@ApiTags('health')
@Public()
@Controller({
    path: 'health',
})
export class HealthController {
    @Get('/')
    async health(): Promise<string> {
        return "OK"
    }
}