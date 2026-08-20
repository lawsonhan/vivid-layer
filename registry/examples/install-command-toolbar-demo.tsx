"use client"

import { BotIcon, CodeIcon, WandSparklesIcon } from "lucide-react"

import {
  InstallCommandToolbar,
  type InstallCommandToolbarProvider,
} from "@/components/ui/install-command-toolbar"
import type { InstallCommandCommands } from "@/components/ui/install-command"

const commands = {
  npm: "npx shadcn@latest add @vivid-layer/install-command-toolbar",
  pnpm: "pnpm dlx shadcn@latest add @vivid-layer/install-command-toolbar",
  yarn: "yarn dlx shadcn@latest add @vivid-layer/install-command-toolbar",
  bun: "bunx --bun shadcn@latest add @vivid-layer/install-command-toolbar",
} satisfies InstallCommandCommands

const providers = [
  {
    value: "assistant",
    label: "AI assistant",
    prompt: "Explain how to integrate the installed component.",
    icon: BotIcon,
  },
  {
    value: "editor",
    label: "Code editor",
    prompt: "Integrate the installed component into the current project.",
    icon: CodeIcon,
  },
  {
    value: "builder",
    label: "App builder",
    prompt: "Build an interface using the installed component.",
    icon: WandSparklesIcon,
  },
] satisfies readonly InstallCommandToolbarProvider[]

export default function InstallCommandToolbarDemo() {
  return (
    <div className="flex h-72 w-full items-center justify-center p-6">
      <InstallCommandToolbar
        commands={commands}
        providers={providers}
        previewHref="/preview/install-command-toolbar-demo"
      />
    </div>
  )
}
