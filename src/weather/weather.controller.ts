import { Controller, Get, Param, ParseFloatPipe } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':latitude/:longitude')
  getCurrent(
    @Param('latitude', ParseFloatPipe) latitude: number,
    @Param('longitude', ParseFloatPipe) longitude: number,
  ) {
    return this.weatherService.get(latitude, longitude);
  }
}
