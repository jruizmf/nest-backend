// Shape returned to the frontend, mapped from the Places API (New) searchText response.
// https://developers.google.com/maps/documentation/places/web-service/text-search
export class PlaceResultDto {
  placeId!: string;
  name!: string;
  address!: string;
  lat!: number;
  lng!: number;
}

// Subset of Google's actual response we read from (shaped by the X-Goog-FieldMask
// header the service sends - only ask for what's mapped below).
export interface GooglePlacesSearchTextResponse {
  places?: {
    id: string;
    displayName?: { text: string };
    formattedAddress?: string;
    location?: { latitude: number; longitude: number };
  }[];
}
