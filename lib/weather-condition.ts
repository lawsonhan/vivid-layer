export type WeatherCondition =
  | "clear-day"
  | "partly-cloudy-day"
  | "overcast"
  | "drizzle"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "wind"
  | "clear-night"
  | "partly-cloudy-night"

export const weatherConditionLabels = {
  "clear-day": "Clear day",
  "partly-cloudy-day": "Partly cloudy day",
  overcast: "Overcast",
  drizzle: "Drizzle",
  rain: "Rain",
  thunderstorm: "Thunderstorm",
  snow: "Snow",
  wind: "Wind",
  "clear-night": "Clear night",
  "partly-cloudy-night": "Partly cloudy night",
} as const satisfies Record<WeatherCondition, string>

const weatherConditionIconSources = {
  "clear-day": "/weather-assets/clear-day.webp",
  "partly-cloudy-day": "/weather-assets/partly-cloudy-day.webp",
  overcast: "/weather-assets/overcast.webp",
  drizzle: "/weather-assets/drizzle.webp",
  rain: "/weather-assets/rain.webp",
  thunderstorm: "/weather-assets/thunderstorm.webp",
  snow: "/weather-assets/snow.webp",
  wind: "/weather-assets/wind.webp",
  "clear-night": "/weather-assets/clear-night.webp",
  "partly-cloudy-night": "/weather-assets/partly-cloudy-night.webp",
} as const satisfies Record<WeatherCondition, string>

export function getWeatherConditionIconSrc(condition: WeatherCondition) {
  return weatherConditionIconSources[condition]
}
