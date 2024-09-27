import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('lookup/:licensePlate')
  async lookupCar(@Param('licensePlate') licensePlate: string) {
    return this.appService.lookupCar(licensePlate);
  }

  @Get('services/:acquisitionType')
  async getServicePrices(@Param('acquisitionType') acquisitionType: string) {
    return this.appService.getServicePrices(acquisitionType);
  }
}
