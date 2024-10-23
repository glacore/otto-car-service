import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pg from 'pg';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { IsString, IsEmail, IsPhoneNumber, IsNumber, IsArray, IsDate, IsBoolean, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface CarDetails {
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  fuelType: string;
  seats: number;
  engineCapacity: number;
  cylinders: number;
  firstRegistrationDate: string;
}

export interface ServicePrice {
  name: string;
  price: number;
}

export interface AppointmentDetails {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  acquisitionType: string;
  mileage: number;
  services: string[];
  comments: string;
  appointmentDate: string;
  appointmentTime: string;
  licensePlate: string;
}

class AppointmentDetailsDTO {
  @IsString()
  licensePlate: string;

  @IsString()
  acquisitionType: string;

  @IsNumber()
  mileage: number;

  @IsArray()
  @IsString({ each: true })
  services: string[];

  @IsString()
  comments: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  appointmentDate: string;

  @IsString()
  appointmentTime: string;

  @IsNumber()
  totalPrice: number;

  @IsBoolean()
  privacyAccepted: boolean;
}

@Injectable()
export class AppService {
  private pool: pg.Pool;

  constructor(private configService: ConfigService) {
    this.pool = new pg.Pool({
      user: this.configService.get('DB_USER'),
      host: this.configService.get('DB_HOST'),
      database: this.configService.get('DB_NAME'),
      password: this.configService.get('DB_PASSWORD'),
      port: parseInt(this.configService.get('DB_PORT'), 10),
    });
  }

  async lookupCar(licensePlate: string): Promise<CarDetails> {
    console.log('Requesting data from overheid.io for:', licensePlate);
    console.log('Using API Key:', process.env.OVERHEID_API_KEY);

    try {
      const response = await axios.get(
        `https://api.overheid.io/voertuiggegevens/${licensePlate}`,
        {
          headers: { 'ovio-api-key': process.env.OVERHEID_API_KEY },
        },
      );

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      const {
        kentekenplaat,
        merk,
        handelsbenaming,
        eerste_kleur,
        datum_eerste_toelating,
        brandstof,
        aantal_zitplaatsen,
        aantal_cilinders,
        cilinderinhoud,
      } = response.data;

      return {
        licensePlate: kentekenplaat,
        brand: merk,
        model: handelsbenaming,
        color: eerste_kleur,
        firstRegistrationDate: datum_eerste_toelating,
        fuelType: brandstof[0]?.brandstof_omschrijving,
        seats: aantal_zitplaatsen,
        cylinders: aantal_cilinders,
        engineCapacity: cilinderinhoud,
      };
    } catch (error) {
      console.error('Error in API call:', error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          'Failed to fetch car details',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'An unexpected error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getServicePrices(acquisitionType: string): Promise<ServicePrice[]> {
    try {
      const result = await this.pool.query(
        'SELECT name, price FROM services WHERE acquisition_type = $1',
        [acquisitionType],
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching service prices:', error);
      throw new HttpException(
        'Failed to fetch service prices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAppointment(appointmentDetails: Omit<AppointmentDetails, 'id'>): Promise<AppointmentDetails> {
    const appointmentDTO = plainToClass(AppointmentDetailsDTO, appointmentDetails);
    const errors = validateSync(appointmentDTO);

    if (errors.length > 0) {
      throw new HttpException({ message: 'Validation failed', errors }, HttpStatus.BAD_REQUEST);
    }

    if (!appointmentDTO.privacyAccepted) {
      throw new HttpException('Privacy policy must be accepted', HttpStatus.BAD_REQUEST);
    }

    const id = uuidv4();
    const query = `
      INSERT INTO appointments (
        id, license_plate, acquisition_type, mileage, services, comments,
        full_name, email, phone_number, appointment_date, appointment_time, total_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const appointmentDate = new Date(appointmentDetails.appointmentDate);
    if (isNaN(appointmentDate.getTime())) {
      throw new HttpException('Invalid appointment date', HttpStatus.BAD_REQUEST);
    }

    const values = [
      id,
      appointmentDTO.licensePlate,
      appointmentDTO.acquisitionType,
      appointmentDTO.mileage,
      JSON.stringify(appointmentDTO.services),
      appointmentDTO.comments,
      appointmentDTO.fullName,
      appointmentDTO.email,
      appointmentDTO.phoneNumber,
      appointmentDate,
      appointmentDTO.appointmentTime,
      appointmentDTO.totalPrice,
    ];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new HttpException('Failed to create appointment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointment(id: string): Promise<AppointmentDetails> {
  try {
    const result = await this.pool.query(
      'SELECT * FROM appointments WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw new HttpException('Failed to fetch appointment', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

async validateAdmin(username: string, password: string): Promise<boolean> {
  const query = 'SELECT password_hash FROM admin_users WHERE username = $1';
  const result = await this.pool.query(query, [username]);
  
  if (result.rows.length === 0) {
    return false;
  }
  
  const passwordHash = result.rows[0].password_hash;
  return bcrypt.compare(password, passwordHash);
}

generateAdminToken(username: string): string {
  const jwtSecret = this.configService.get<string>('JWT_SECRET');
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  return jwt.sign(
    { username },
    jwtSecret,
    { expiresIn: '1h' }
  );
}

async getAllAppointments(page: number = 1, limit: number = 10): Promise<{ appointments: AppointmentDetails[], total: number }> {
  try {
    const offset = (page - 1) * limit;
    const countQuery = 'SELECT COUNT(*) FROM appointments';
    const appointmentsQuery = 'SELECT * FROM appointments ORDER BY appointment_date DESC, appointment_time DESC LIMIT $1 OFFSET $2';
    
    const [countResult, appointmentsResult] = await Promise.all([
      this.pool.query(countQuery),
      this.pool.query(appointmentsQuery, [limit, offset])
    ]);

    const total = parseInt(countResult.rows[0].count);
    const appointments = appointmentsResult.rows;

    return { appointments, total };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new HttpException('Failed to fetch appointments', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

async updateAppointment(id: string, appointmentDetails: AppointmentDetails): Promise<AppointmentDetails> {
  try {
    console.log('Updating appointment with ID:', id);
    console.log('Appointment details:', JSON.stringify(appointmentDetails, null, 2));
    const query = `
      UPDATE appointments
      SET full_name = $1, email = $2, phone_number = $3, acquisition_type = $4,
          mileage = $5, services = $6, comments = $7, appointment_date = $8,
          appointment_time = $9, license_plate = COALESCE($10, license_plate)
      WHERE id = $11
      RETURNING *
    `;
    const values = [
      appointmentDetails.fullName,
      appointmentDetails.email,
      appointmentDetails.phoneNumber,
      appointmentDetails.acquisitionType,
      appointmentDetails.mileage,
      JSON.stringify(appointmentDetails.services),
      appointmentDetails.comments,
      appointmentDetails.appointmentDate,
      appointmentDetails.appointmentTime,
      appointmentDetails.licensePlate,
      id
    ];
    console.log('Executing query with values:', values);
    const result = await this.pool.query(query, values);
    console.log('Query result:', result);
    if (result.rows.length === 0) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error updating appointment:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    if (error instanceof Error) {
      throw new HttpException(`Failed to update appointment: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      throw new HttpException('Failed to update appointment: Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
}
