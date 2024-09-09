import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('lookup/:licensePlate')
  async lookupCar(@Param('licensePlate') licensePlate: string) {
    return this.appService.lookupCar(licensePlate);
  }
}
