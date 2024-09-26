import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

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

@Injectable()
export class AppService {
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
}
