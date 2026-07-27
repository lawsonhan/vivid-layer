import { MultiDayWeatherCard } from "@/components/ui/multi-day-weather-card"

export default function MultiDayWeatherCardDemo() {
  return (
    <div className="flex h-[28rem] w-full items-center justify-center p-6 sm:p-10">
      <MultiDayWeatherCard className="w-full max-w-sm" />
    </div>
  )
}
