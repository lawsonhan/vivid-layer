import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getWeatherConditionIconSrc,
  weatherConditionLabels,
  type WeatherCondition,
} from "@/lib/weather-condition"
import { cn } from "@/lib/utils"

type WeatherCardSize = "default" | "lg"

type WeatherDay = {
  condition: WeatherCondition
  conditionIconSrc?: string
  temperature: string
}

const defaultDays = [
  { condition: "clear-day", temperature: "25°C" },
  { condition: "partly-cloudy-day", temperature: "24°C" },
  { condition: "rain", temperature: "21°C" },
  { condition: "wind", temperature: "22°C" },
  { condition: "clear-day", temperature: "26°C" },
] as const satisfies readonly WeatherDay[]

const defaultWeather = {
  condition: "partly-cloudy-day",
  location: "Sydney",
  conditionDescription:
    "Partly cloudy with sunny breaks expected through the afternoon.",
  lowTemperature: "17°C",
  highTemperature: "24°C",
  background:
    "linear-gradient(111deg, #1769C8 0%, #258AE3 56.92%, #31A3F8 100%)",
} as const

type MultiDayWeatherCardProps = Omit<
  React.ComponentProps<typeof Card>,
  "children" | "size"
> & {
  size?: WeatherCardSize
  condition?: WeatherCondition
  conditionIconSrc?: string
  location?: string
  conditionDescription?: string
  lowTemperature?: string
  highTemperature?: string
  days?: readonly WeatherDay[]
  background?: React.CSSProperties["background"]
}

function MultiDayWeatherCard({
  size = "lg",
  condition = defaultWeather.condition,
  conditionIconSrc,
  location = defaultWeather.location,
  conditionDescription = defaultWeather.conditionDescription,
  lowTemperature = defaultWeather.lowTemperature,
  highTemperature = defaultWeather.highTemperature,
  days = defaultDays,
  background = defaultWeather.background,
  className,
  style,
  ...props
}: MultiDayWeatherCardProps) {
  const cardStyle = {
    "--card-foreground": "white",
    "--muted-foreground": "rgb(255 255 255 / 0.8)",
    ...style,
    background,
  } as React.CSSProperties

  return (
    <Card
      {...props}
      data-weather-size={size}
      className={cn(
        "group/multi-day-weather-card gap-3 rounded-[20px] py-8",
        className
      )}
      style={cardStyle}
    >
      <CardHeader className="items-center justify-items-center gap-3 px-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={conditionIconSrc ?? getWeatherConditionIconSrc(condition)}
          alt=""
          width={64}
          height={64}
          className="size-14 object-contain group-data-[weather-size=lg]/multi-day-weather-card:size-16"
        />
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-2xl font-normal text-muted-foreground group-data-[weather-size=lg]/multi-day-weather-card:text-[2rem] group-data-[weather-size=lg]/multi-day-weather-card:leading-10">
            {lowTemperature}
          </span>
          <span className="text-2xl font-normal group-data-[weather-size=lg]/multi-day-weather-card:text-[2rem] group-data-[weather-size=lg]/multi-day-weather-card:leading-10">
            {highTemperature}
          </span>
        </div>
        <CardTitle className="group-data-[weather-size=lg]/multi-day-weather-card:text-base">
          {location}
        </CardTitle>
        <CardDescription className="max-w-sm text-center group-data-[weather-size=lg]/multi-day-weather-card:text-base">
          {conditionDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-4 px-8 group-data-[weather-size=lg]/multi-day-weather-card:gap-8">
        {days.map((item, index) => (
          <div
            key={`${item.condition}-${item.temperature}-${index}`}
            className="flex flex-col items-center gap-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                item.conditionIconSrc ??
                getWeatherConditionIconSrc(item.condition)
              }
              alt=""
              width={40}
              height={40}
              className="size-9 object-contain"
            />
            <span className="sr-only">
              {weatherConditionLabels[item.condition]}:
            </span>
            <span>{item.temperature}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export {
  MultiDayWeatherCard,
  type MultiDayWeatherCardProps,
  type WeatherCardSize,
  type WeatherCondition,
  type WeatherDay,
}
