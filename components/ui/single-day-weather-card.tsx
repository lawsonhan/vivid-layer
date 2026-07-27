import * as React from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getWeatherConditionIconSrc,
  type WeatherCondition,
} from "@/lib/weather-condition"
import { cn } from "@/lib/utils"

const defaultWeather = {
  condition: "partly-cloudy-day",
  location: "Sydney",
  conditionDescription:
    "Partly cloudy with sunny breaks expected through the afternoon.",
  temperature: "24°C",
  background:
    "linear-gradient(111deg, #1769C8 0%, #258AE3 56.92%, #31A3F8 100%)",
} as const

type SingleDayWeatherCardProps = Omit<
  React.ComponentProps<typeof Card>,
  "children" | "size"
> & {
  condition?: WeatherCondition
  location?: string
  conditionIconSrc?: string
  conditionDescription?: string
  temperature?: string
  background?: React.CSSProperties["background"]
}

function SingleDayWeatherCard({
  condition = defaultWeather.condition,
  location = defaultWeather.location,
  conditionIconSrc,
  conditionDescription = defaultWeather.conditionDescription,
  temperature = defaultWeather.temperature,
  background = defaultWeather.background,
  className,
  style,
  ...props
}: SingleDayWeatherCardProps) {
  const resolvedConditionIconSrc =
    conditionIconSrc ?? getWeatherConditionIconSrc(condition)
  const cardStyle = {
    "--card-foreground": "white",
    "--muted-foreground": "rgb(255 255 255 / 0.8)",
    ...style,
    background,
  } as React.CSSProperties

  return (
    <Card
      {...props}
      className={cn("rounded-[20px] py-8", className)}
      style={cardStyle}
    >
      <CardHeader className="items-center gap-4 text-center">
        <div className="flex items-center justify-self-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={resolvedConditionIconSrc}
            src={resolvedConditionIconSrc}
            alt=""
            width={80}
            height={80}
            className="size-16 object-contain"
          />
          <span className="text-4xl font-normal">{temperature}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CardTitle>{location}</CardTitle>
          <CardDescription className="text-center">
            {conditionDescription}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

export {
  SingleDayWeatherCard,
  type SingleDayWeatherCardProps,
  type WeatherCondition,
}
