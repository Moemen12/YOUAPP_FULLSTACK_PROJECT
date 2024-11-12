import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async isMicroServiceRunning() {
    return '<h2 style="display:flex;align-items:center;justify-content:center;text-align:center;height:100vh">API GATEWAY MICROSERVICE IS RUNNING ...</h2>';
  }
}
