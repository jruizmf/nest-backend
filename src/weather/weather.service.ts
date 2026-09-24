import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  OpenWeatherMapCurrentResponse,
  WeatherCurrentDto,
} from './dto/weather.dto';

const METERS_PER_SECOND_TO_KMH = 3.6;

@Injectable()
export class WeatherService {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async get(latitude: number, longitude: number): Promise<WeatherCurrentDto> {
    const apiKey = this.configService.getOrThrow<string>(
      'OPEN_WEATHER_API_KEY',
    );
    const url =
      `${this.baseUrl}?lat=${latitude}&lon=${longitude}` +
      `&appid=${apiKey}&units=metric&lang=es`;

    const response = await firstValueFrom(
      this.httpService.get<OpenWeatherMapCurrentResponse>(url),
    );
    const data = response.data;
    const conditions = data.weather[0];

    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      condition: conditions?.description ?? '',
      icon: conditions?.icon ?? '',
      windSpeed: data.wind.speed * METERS_PER_SECOND_TO_KMH,
      humidity: data.main.humidity,
      cityName: data.name,
    };
  }
}
