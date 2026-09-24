import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    const trimmed = query?.trim();
    if (!trimmed) {
      return [];
    }
    return this.placesService.search(
      trimmed,
      lat ? Number(lat) : undefined,
      lng ? Number(lng) : undefined,
    );
  }
}
