import {
  SingleDayWeatherCard,
  type WeatherCondition,
} from "@/components/ui/single-day-weather-card"

type WeatherGradientColors = readonly [string, string, string]

interface WeatherGradient {
  angle: number
  colors: WeatherGradientColors
}

interface SingleDayWeatherPreset {
  condition: WeatherCondition
  label: string
  temperature: string
  conditionDescription: string
  gradient: WeatherGradient
}

const singleDayWeatherLocation = "Sydney"

const gradients = {
  sunny: {
    angle: 111,
    colors: ["#1769C8", "#258AE3", "#31A3F8"],
  },
  cloudy: {
    angle: 120,
    colors: ["#30485F", "#49677F", "#627F94"],
  },
  rain: {
    angle: 125,
    colors: ["#123B62", "#1F5D88", "#347FA7"],
  },
  storm: {
    angle: 135,
    colors: ["#111C38", "#263B63", "#425D85"],
  },
  winter: {
    angle: 120,
    colors: ["#31556F", "#47748F", "#5F8BA3"],
  },
  atmosphere: {
    angle: 110,
    colors: ["#334C58", "#4A6873", "#607E89"],
  },
  night: {
    angle: 130,
    colors: ["#071632", "#102A58", "#244983"],
  },
} as const satisfies Record<string, WeatherGradient>

const singleDayWeatherPresets = [
  {
    condition: "partly-cloudy-day",
    label: "Partly Cloudy",
    temperature: "24°C",
    conditionDescription:
      "Partly cloudy with sunny breaks expected through the afternoon.",
    gradient: gradients.sunny,
  },
  {
    condition: "clear-day",
    label: "Clear Day",
    temperature: "27°C",
    conditionDescription:
      "Clear skies and bright sunshine are expected through the afternoon.",
    gradient: gradients.sunny,
  },
  {
    condition: "overcast",
    label: "Overcast",
    temperature: "21°C",
    conditionDescription:
      "Cloud cover will remain steady with mild and calm conditions.",
    gradient: gradients.cloudy,
  },
  {
    condition: "drizzle",
    label: "Drizzle",
    temperature: "19°C",
    conditionDescription:
      "Light drizzle is expected intermittently through the afternoon.",
    gradient: gradients.rain,
  },
  {
    condition: "rain",
    label: "Rain",
    temperature: "18°C",
    conditionDescription:
      "Steady rain will continue with occasional heavier showers.",
    gradient: gradients.rain,
  },
  {
    condition: "thunderstorm",
    label: "Thunderstorm",
    temperature: "20°C",
    conditionDescription:
      "Thunderstorms may bring intense downpours, gusty winds, and lightning.",
    gradient: gradients.storm,
  },
  {
    condition: "snow",
    label: "Snow",
    temperature: "1°C",
    conditionDescription:
      "Light snow is expected to continue with gradual accumulation.",
    gradient: gradients.winter,
  },
  {
    condition: "wind",
    label: "Wind",
    temperature: "22°C",
    conditionDescription:
      "Strong winds are expected with higher gusts near exposed areas.",
    gradient: gradients.atmosphere,
  },
  {
    condition: "clear-night",
    label: "Clear Night",
    temperature: "18°C",
    conditionDescription:
      "Clear skies and calm conditions are expected overnight.",
    gradient: gradients.night,
  },
  {
    condition: "partly-cloudy-night",
    label: "Partly Cloudy Night",
    temperature: "17°C",
    conditionDescription:
      "Partly cloudy skies will continue through the evening.",
    gradient: gradients.night,
  },
] as const satisfies readonly SingleDayWeatherPreset[]

const defaultSingleDayWeatherPreset = singleDayWeatherPresets[0]

function formatWeatherGradient({ angle, colors }: WeatherGradient) {
  return `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1]} 56.92%, ${colors[2]} 100%)`
}

export default function SingleDayWeatherCardDemo({
  preset = defaultSingleDayWeatherPreset,
  background,
  condition = preset.condition,
}: {
  preset?: SingleDayWeatherPreset
  background?: string
  condition?: WeatherCondition
}) {
  return (
    <div className="flex h-[28rem] w-full items-center justify-center p-6 sm:p-10">
      <SingleDayWeatherCard
        className="w-full max-w-sm"
        condition={condition}
        location={singleDayWeatherLocation}
        temperature={preset.temperature}
        conditionDescription={preset.conditionDescription}
        background={background ?? formatWeatherGradient(preset.gradient)}
      />
    </div>
  )
}

export {
  defaultSingleDayWeatherPreset,
  formatWeatherGradient,
  singleDayWeatherLocation,
  singleDayWeatherPresets,
}
export type { SingleDayWeatherPreset, WeatherGradient }
