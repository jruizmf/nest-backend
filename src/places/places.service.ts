import { BadGatewayException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { AxiosResponse } from 'axios';
import {
  GooglePlacesSearchTextResponse,
  PlaceResultDto,
} from './dto/place-result.dto';

const MAX_RESULTS = 8;
const SEARCH_RADIUS_METERS = 15000;
const FIELD_MASK =
  'places.id,places.displayName,places.formattedAddress,places.location';

@Injectable()
export class PlacesService {
  // The legacy /place/textsearch endpoint isn't enabled for this project ("You're
  // calling a legacy API" / REQUEST_DENIED) - Google routes new projects to this
  // one (Places API (New)) instead.
  private readonly baseUrl =
    'https://places.googleapis.com/v1/places:searchText';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async search(
    query: string,
    latitude?: number,
    longitude?: number,
  ): Promise<PlaceResultDto[]> {
    const apiKey = this.configService.getOrThrow<string>('GOOGLE_MAPS_API_KEY');

    const body: Record<string, unknown> = { textQuery: query };
    if (latitude !== undefined && longitude !== undefined) {
      body.locationBias = {
        circle: {
          center: { latitude, longitude },
          radius: SEARCH_RADIUS_METERS,
        },
      };
    }

    let response: AxiosResponse<GooglePlacesSearchTextResponse>;
    try {
      response = await firstValueFrom(
        this.httpService.post<GooglePlacesSearchTextResponse>(
          this.baseUrl,
          body,
          {
            headers: {
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': FIELD_MASK,
            },
          },
        ),
      );
    } catch {
      throw new BadGatewayException('Places search failed');
    }

    const places = response.data.places ?? [];
    return places.slice(0, MAX_RESULTS).map((place) => ({
      placeId: place.id,
      name: place.displayName?.text ?? '',
      address: place.formattedAddress ?? '',
      lat: place.location?.latitude ?? 0,
      lng: place.location?.longitude ?? 0,
    }));
  }
}
