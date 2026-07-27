"use client"

import * as React from "react"
import { CheckIcon, FullscreenIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InstallCommand,
  type InstallCommandCommands,
  type PackageManager,
} from "@/components/ui/install-command"
import { cn } from "@/lib/utils"

export type InstallCommandToolbarProvider = {
  value: string
  label: string
  prompt: string
  icon?: React.ComponentType<React.ComponentProps<"svg">>
}

export type InstallCommandToolbarProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  commands: InstallCommandCommands
  providers: readonly InstallCommandToolbarProvider[]
  value?: PackageManager
  defaultValue?: PackageManager
  onValueChange?: (value: PackageManager) => void
  previewHref?: string
}

export function InstallCommandToolbar({
  commands,
  providers,
  value,
  defaultValue,
  onValueChange,
  previewHref,
  className,
  ...props
}: InstallCommandToolbarProps) {
  return (
    <div
      role="group"
      aria-label="Install command toolbar"
      data-slot="install-command-toolbar"
      className={cn(
        "flex h-9 w-full min-w-0 items-stretch gap-[3px] rounded-[11px] bg-[color-mix(in_oklch,var(--background),var(--foreground)_8%)] p-[3px] sm:w-[32rem]",
        className
      )}
      {...props}
    >
      <InstallCommand
        commands={commands}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        className="h-full w-auto max-w-none flex-1 rounded-none bg-transparent p-0 sm:w-auto"
      />
      <CopyPromptMenu providers={providers} />
      {previewHref ? (
        <a
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open preview in a new tab"
          title="Open preview in a new tab"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon-sm" }),
            "h-full w-[30px] flex-none rounded-[8px] shadow-xs"
          )}
        >
          <FullscreenIcon aria-hidden="true" />
        </a>
      ) : null}
    </div>
  )
}

function CopyPromptMenu({
  providers,
}: {
  providers: readonly InstallCommandToolbarProvider[]
}) {
  const [copiedProvider, setCopiedProvider] = React.useState<string | null>(
    null
  )
  const timeoutRef = React.useRef<number | null>(null)
  const copiedOption = providers.find(
    (option) => option.value === copiedProvider
  )

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  async function copyPrompt(provider: InstallCommandToolbarProvider) {
    await navigator.clipboard.writeText(provider.prompt)
    setCopiedProvider(provider.value)

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopiedProvider(null)
      timeoutRef.current = null
    }, 2000)
  }

  function handleCopy(provider: InstallCommandToolbarProvider) {
    void copyPrompt(provider).catch((error: unknown) => {
      console.error(`Failed to copy ${provider.label} prompt.`, error)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={
              copiedOption
                ? `Copied ${copiedOption.label} prompt`
                : "Copy prompt"
            }
            className="h-full w-[101px] flex-none rounded-[8px] px-2.5 shadow-xs"
          />
        }
      >
        {copiedProvider ? (
          <>
            <CheckIcon data-icon="inline-start" aria-hidden="true" />
            <span aria-live="polite">Copied</span>
          </>
        ) : (
          "Copy prompt"
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={6}
        className="w-40"
      >
        <DropdownMenuGroup>
          {providers.map((provider) => {
            const Icon = provider.icon

            return (
              <DropdownMenuItem
                key={provider.value}
                className="h-9 gap-2 px-2 py-0"
                onClick={() => handleCopy(provider)}
              >
                {Icon ? <Icon aria-hidden="true" /> : null}
                {provider.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
