import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    test(): string {
        return 'Hello World!';
    }
}
