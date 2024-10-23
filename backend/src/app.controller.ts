import { Controller, Get, Post, Param, Body, UnauthorizedException, Put, Query } from '@nestjs/common';
import { AppService } from './app.service.js';
import { AppointmentDetails } from './app.service.js';

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

  @Post('appointments')
  async createAppointment(@Body() appointmentDetails: any) {
    return this.appService.createAppointment(appointmentDetails);
  }

  @Get('appointments/:id')
  async getAppointment(@Param('id') id: string) {
    return this.appService.getAppointment(id);
  }

  @Get('appointments')
  async getAllAppointments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.appService.getAllAppointments(page, limit);
  }

  @Post('admin/login')
  async adminLogin(@Body() loginData: { username: string; password: string }) {
    const isValid = await this.appService.validateAdmin(loginData.username, loginData.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.appService.generateAdminToken(loginData.username);
    return { token };
  }

  @Put('appointments/:id')
  async updateAppointment(@Param('id') id: string, @Body() appointmentDetails: AppointmentDetails) {
    return this.appService.updateAppointment(id, appointmentDetails);
  }
}
