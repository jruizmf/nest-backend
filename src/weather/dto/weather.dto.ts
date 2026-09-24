// Shape returned to the frontend, mapped from OpenWeatherMap's /data/2.5/weather response.
// https://openweathermap.org/current
export class WeatherCurrentDto {
  temperature!: number; // °C
  feelsLike!: number; // °C
  condition!: string; // localized description, e.g. "lluvia moderada" (lang=es)
  icon!: string; // OpenWeatherMap icon code, e.g. "10d"
  windSpeed!: number; // km/h (OpenWeatherMap reports m/s even with units=metric)
  humidity!: number; // %
  cityName!: string;
}

// Subset of OpenWeatherMap's actual response we read from.
export interface OpenWeatherMapCurrentResponse {
  weather: { description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number };
  name: string;
}
