"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const

export type PackageManager = (typeof packageManagers)[number]

export type InstallCommandCommands = Record<PackageManager, string>

export type InstallCommandProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  commands: InstallCommandCommands
  value?: PackageManager
  defaultValue?: PackageManager
  onValueChange?: (value: PackageManager) => void
}

type PackageManagerIcon = React.ComponentType<React.ComponentProps<"svg">>

const packageManagerOptions = [
  { value: "npm", label: "npm", icon: NpmIcon },
  { value: "pnpm", label: "pnpm", icon: PnpmIcon },
  { value: "yarn", label: "yarn", icon: YarnIcon },
  { value: "bun", label: "bun", icon: BunIcon },
] as const satisfies readonly {
  value: PackageManager
  label: string
  icon: PackageManagerIcon
}[]

export function InstallCommand({
  commands,
  value: controlledValue,
  defaultValue = "npm",
  onValueChange,
  className,
  ...props
}: InstallCommandProps) {
  const [internalValue, setInternalValue] =
    React.useState<PackageManager>(defaultValue)
  const manager = controlledValue ?? internalValue
  const activeOption = packageManagerOptions.find(
    (option) => option.value === manager
  )
  const command = commands[manager]

  if (!activeOption) {
    throw new Error(`Unknown package manager: ${manager}`)
  }

  function handleValueChange(nextValue: string | null) {
    if (!packageManagers.includes(nextValue as PackageManager)) return

    const packageManager = nextValue as PackageManager

    if (controlledValue === undefined) {
      setInternalValue(packageManager)
    }

    onValueChange?.(packageManager)
  }

  return (
    <div
      role="group"
      aria-label="Install command"
      data-slot="install-command"
      className={cn(
        "h-9 w-full max-w-80 min-w-0 rounded-[11px] bg-[color-mix(in_oklch,var(--background),var(--foreground)_8%)] p-[3px]",
        className
      )}
      {...props}
    >
      <div
        className="flex h-full min-w-0 items-stretch overflow-hidden rounded-[8px] border-[0.5px] border-foreground/15 bg-background shadow-[0_0.5px_1px_rgb(0_0_0/0.06),0_2.5px_8px_rgb(0_0_0/0.05)]"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5 py-0 pr-1 pl-2">
          <span
            className="grid size-3.5 flex-none place-items-center"
            aria-hidden="true"
          >
            <activeOption.icon className="size-full" />
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-xs leading-none tracking-[-0.02em]">
            {command}
          </span>
          <CopyCommandButton
            key={`${manager}:${command}`}
            command={command}
          />
        </div>
        <Select
          items={packageManagerOptions}
          value={manager}
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            aria-label="Choose package manager"
            className="h-full w-7 flex-none justify-center gap-0 rounded-none border-0 border-l-[0.5px] border-foreground/15 bg-transparent px-0 py-0 hover:bg-muted data-[size=default]:h-full data-popup-open:[&>svg]:rotate-180 [&>svg]:size-3 [&>svg]:text-foreground/80 [&>svg]:transition-transform"
          >
            <SelectValue className="sr-only" />
          </SelectTrigger>
          <SelectContent
            align="end"
            alignItemWithTrigger={false}
            sideOffset={3}
            className="w-[121px] min-w-0 rounded-[9px] p-1 shadow-[0_8.5px_23px_rgb(0_0_0/0.12),0_1px_4px_rgb(0_0_0/0.08)] ring-foreground/15"
          >
            <SelectGroup className="p-0">
              {packageManagerOptions.map((option) => {
                const Icon = option.icon

                return (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="h-7 gap-2 rounded-[6px] px-1.5 pr-6 text-xs leading-none font-medium [&>span:last-child]:right-2 [&>span:last-child]:size-3 [&>span:last-child>svg]:size-3"
                  >
                    <span
                      className="grid size-3.5 flex-none place-items-center"
                      aria-hidden="true"
                    >
                      <Icon className="size-full" />
                    </span>
                    {option.label}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function CopyCommandButton({
  command,
}: {
  command: string
}) {
  const [isCopied, setIsCopied] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)
  const StatusIcon = isCopied ? CheckIcon : CopyIcon
  const label = isCopied ? `Copied ${command}` : `Copy ${command}`

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  async function copyCommand() {
    await navigator.clipboard.writeText(command)
    setIsCopied(true)

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsCopied(false)
      timeoutRef.current = null
    }, 2000)
  }

  function handleCopy() {
    void copyCommand().catch((error: unknown) => {
      console.error("Failed to copy install command.", error)
    })
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      title={command}
      className="flex-none rounded-md"
      onClick={handleCopy}
    >
      <StatusIcon aria-hidden="true" />
    </Button>
  )
}

// Official brand marks. npm/yarn use a light backing so the negative-space
// glyph stays visible in both light and dark themes.
function NpmIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="1" y="1" width="22" height="22" rx="2" fill="#fff" />
      <path
        fill="#CB3837"
        d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
      />
    </svg>
  )
}

function PnpmIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 128 128" fill="none" {...props}>
      <path
        fill="#f8ab00"
        d="M0 .004V40h39.996V.004Zm43.996 0V40h40V.004Zm44.008 0V40H128V.004Zm0 43.996v39.996H128V44Z"
      />
      <path
        fill="#4c4c4c"
        d="M43.996 44v39.996h40V44ZM0 87.996v40h39.996v-40Zm43.996 0v40h40v-40Zm44.008 0v40H128v-40Z"
      />
    </svg>
  )
}

function YarnIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 128 128" fill="none" {...props}>
      <circle cx="64" cy="64" r="62" fill="#fff" />
      <path
        fill="#2c8ebb"
        d="M64 0a64 64 0 1 0 64 64A64 64 0 0 0 64 0Zm4.685 21.948a5.037 5.037 0 0 1 2.21.802c.671.444 1.528 1.032 4.026 6.194a4.841 4.841 0 0 1 2.942-.103 3.933 3.933 0 0 1 2.468 2.004c2.55 4.893 2.889 13.614 1.774 19.22a34.89 34.89 0 0 1-6.028 13.74 26.56 26.56 0 0 1 5.957 9.733 26.24 26.24 0 0 1 1.456 10.746 29.626 29.626 0 0 0 3.22-1.796c3.158-1.951 7.927-4.894 13.615-4.966a6.834 6.834 0 0 1 7.225 5.885 6.555 6.555 0 0 1-5.046 7.256c-3.458.836-5.069 1.486-9.714 4.5a69.161 69.161 0 0 1-16.062 7.412 8.991 8.991 0 0 1-3.758 1.828c-3.933.96-17.425 1.682-18.488 1.682h-.248c-4.13 0-6.47-1.28-7.73-2.621-3.51 1.755-8.052 1.03-11.355-.714a5.729 5.729 0 0 1-3.097-4.024 6.194 6.194 0 0 1 0-2.127 6.875 6.875 0 0 1-.816-1.032 16.908 16.908 0 0 1-2.333-10.386c.3-3.85 2.964-7.287 4.698-9.114A29.481 29.481 0 0 1 35.726 64a27.685 27.685 0 0 1 7.04-9.29c-1.703-2.87-3.436-7.288-1.754-11.789 1.208-3.21 2.199-4.996 4.377-5.76a7.06 7.06 0 0 0 2.59-1.383 18.22 18.22 0 0 1 12.243-5.843c.196-.495.423-1.033.671-1.508 1.652-3.51 3.406-5.48 5.46-6.193a5.037 5.037 0 0 1 2.332-.286zm-.558 3.697c-2.703.089-5.355 8.099-5.355 8.099a14.452 14.452 0 0 0-12.089 4.645 9.951 9.951 0 0 1-3.973 2.345c-.424.144-.94.122-2.22 3.58-1.961 5.234 3.345 11.16 3.345 11.16s-6.328 4.47-8.672 10.034a25.58 25.58 0 0 0-1.806 12.057s-4.5 3.901-4.788 7.927a13.285 13.285 0 0 0 1.826 8.083 2.003 2.003 0 0 0 2.714.94s-2.993 3.487-.196 4.963c2.55 1.331 6.844 2.065 9.115-.196 1.652-1.651 1.982-5.335 2.591-6.842.144-.351.64.588 1.115 1.032a10.323 10.323 0 0 0 1.403 1.032s-4.024 1.734-2.373 5.688c.547 1.31 2.498 2.145 5.688 2.125 1.187 0 14.203-.743 17.671-1.58a4.47 4.47 0 0 0 2.696-1.505 65.032 65.032 0 0 0 15.99-7.226c4.892-3.19 6.895-4.059 10.848-4.998 3.262-.774 3.045-5.83-1.28-5.758-4.48.052-8.402 2.363-11.716 4.427-6.193 3.83-9.29 3.583-9.29 3.583l-.105-.175c-.423-.692 1.983-6.896-.712-14.287-2.91-8.082-7.534-10.033-7.163-10.653 1.58-2.673 5.534-6.917 7.113-14.824.94-4.79.691-12.676-1.435-16.805-.393-.764-3.902 1.28-3.902 1.28s-3.283-7.319-4.201-7.907a1.442 1.442 0 0 0-.839-.244z"
      />
    </svg>
  )
}

// Official bun.sh logo (full mascot).
function BunIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 80 70" fill="none" {...props}>
      <path
        fill="#000"
        d="M71.09,20.74c-.16-.17-.33-.34-.5-.5s-.33-.34-.5-.5-.33-.34-.5-.5-.33-.34-.5-.5-.33-.34-.5-.5-.33-.34-.5-.5-.33-.34-.5-.5A26.46,26.46,0,0,1,75.5,35.7c0,16.57-16.82,30.05-37.5,30.05-11.58,0-21.94-4.23-28.83-10.86l.5.5.5.5.5.5.5.5.5.5.5.5.5.5C19.55,65.3,30.14,69.75,42,69.75c20.68,0,37.5-13.48,37.5-30C79.5,32.69,76.46,26,71.09,20.74Z"
      />
      <g>
        <path
          fill="#fbf0df"
          d="M73,35.7c0,15.21-15.67,27.54-35,27.54S3,50.91,3,35.7C3,26.27,9,17.94,18.22,13S33.18,3,38,3s8.94,4.13,19.78,10C67,17.94,73,26.27,73,35.7Z"
        />
        <path
          fill="#f6dece"
          d="M73,35.7a21.67,21.67,0,0,0-.8-5.78c-2.73,33.3-43.35,34.9-59.32,24.94A40,40,0,0,0,38,63.24C57.3,63.24,73,50.89,73,35.7Z"
        />
        <path
          fill="#fffefc"
          d="M24.53,11.17C29,8.49,34.94,3.46,40.78,3.45A9.29,9.29,0,0,0,38,3c-2.42,0-5,1.25-8.25,3.13-1.13.66-2.3,1.39-3.54,2.15-2.33,1.44-5,3.07-8,4.7C8.69,18.13,3,26.62,3,35.7c0,.4,0,.8,0,1.19C9.06,15.48,20.07,13.85,24.53,11.17Z"
        />
        <path
          fill="#ccbea7"
          fillRule="evenodd"
          d="M35.12,5.53A16.41,16.41,0,0,1,29.49,18c-.28.25-.06.73.3.59,3.37-1.31,7.92-5.23,6-13.14C35.71,5,35.12,5.12,35.12,5.53Zm2.27,0A16.24,16.24,0,0,1,39,19c-.12.35.31.65.55.36C41.74,16.56,43.65,11,37.93,5,37.64,4.74,37.19,5.14,37.39,5.49Zm2.76-.17A16.42,16.42,0,0,1,47,17.12a.33.33,0,0,0,.65.11c.92-3.49.4-9.44-7.17-12.53C40.08,4.54,39.82,5.08,40.15,5.32ZM21.69,15.76a16.94,16.94,0,0,0,10.47-9c.18-.36.75-.22.66.18-1.73,8-7.52,9.67-11.12,9.45C21.32,16.4,21.33,15.87,21.69,15.76Z"
        />
        <path
          fill="#000"
          d="M38,65.75C17.32,65.75.5,52.27.5,35.7c0-10,6.18-19.33,16.53-24.92,3-1.6,5.57-3.21,7.86-4.62,1.26-.78,2.45-1.51,3.6-2.19C32,1.89,35,.5,38,.5s5.62,1.2,8.9,3.14c1,.57,2,1.19,3.07,1.87,2.49,1.54,5.3,3.28,9,5.27C69.32,16.37,75.5,25.69,75.5,35.7,75.5,52.27,58.68,65.75,38,65.75ZM38,3c-2.42,0-5,1.25-8.25,3.13-1.13.66-2.3,1.39-3.54,2.15-2.33,1.44-5,3.07-8,4.7C8.69,18.13,3,26.62,3,35.7,3,50.89,18.7,63.25,38,63.25S73,50.89,73,35.7C73,26.62,67.31,18.13,57.78,13,54,11,51.05,9.12,48.66,7.64c-1.09-.67-2.09-1.29-3-1.84C42.63,4,40.42,3,38,3Z"
        />
      </g>
      <g>
        <path
          fill="#b71422"
          d="M45.05,43a8.93,8.93,0,0,1-2.92,4.71,6.81,6.81,0,0,1-4,1.88A6.84,6.84,0,0,1,34,47.71,8.93,8.93,0,0,1,31.12,43a.72.72,0,0,1,.8-.81H44.26A.72.72,0,0,1,45.05,43Z"
        />
        <path
          fill="#ff6164"
          d="M34,47.79a6.91,6.91,0,0,0,4.12,1.9,6.91,6.91,0,0,0,4.11-1.9,10.63,10.63,0,0,0,1-1.07,6.83,6.83,0,0,0-4.9-2.31,6.15,6.15,0,0,0-5,2.78C33.56,47.4,33.76,47.6,34,47.79Z"
        />
        <path
          fill="#000"
          d="M34.16,47a5.36,5.36,0,0,1,4.19-2.08,6,6,0,0,1,4,1.69c.23-.25.45-.51.66-.77a7,7,0,0,0-4.71-1.93,6.36,6.36,0,0,0-4.89,2.36A9.53,9.53,0,0,0,34.16,47Z"
        />
        <path
          fill="#000"
          d="M38.09,50.19a7.42,7.42,0,0,1-4.45-2,9.52,9.52,0,0,1-3.11-5.05,1.2,1.2,0,0,1,.26-1,1.41,1.41,0,0,1,1.13-.51H44.26a1.44,1.44,0,0,1,1.13.51,1.19,1.19,0,0,1,.25,1h0a9.52,9.52,0,0,1-3.11,5.05A7.42,7.42,0,0,1,38.09,50.19Zm-6.17-7.4c-.16,0-.2.07-.21.09a8.29,8.29,0,0,0,2.73,4.37A6.23,6.23,0,0,0,38.09,49a6.28,6.28,0,0,0,3.65-1.73,8.3,8.3,0,0,0,2.72-4.37.21.21,0,0,0-.2-.09Z"
        />
      </g>
      <g>
        <ellipse fill="#febbd0" cx="53.22" cy="40.18" rx="5.85" ry="3.44" />
        <ellipse fill="#febbd0" cx="22.95" cy="40.18" rx="5.85" ry="3.44" />
        <path
          fill="#000"
          fillRule="evenodd"
          d="M25.7,38.8a5.51,5.51,0,1,0-5.5-5.51A5.51,5.51,0,0,0,25.7,38.8Zm24.77,0A5.51,5.51,0,1,0,45,33.29,5.5,5.5,0,0,0,50.47,38.8Z"
        />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M24,33.64a2.07,2.07,0,1,0-2.06-2.07A2.07,2.07,0,0,0,24,33.64Zm24.77,0a2.07,2.07,0,1,0-2.06-2.07A2.07,2.07,0,0,0,48.75,33.64Z"
        />
      </g>
    </svg>
  )
}
