import {
  InstallCommand,
  type InstallCommandCommands,
} from "@/components/ui/install-command"

const commands = {
  npm: "npx shadcn@latest add @vivid-layer/install-command",
  pnpm: "pnpm dlx shadcn@latest add @vivid-layer/install-command",
  yarn: "yarn dlx shadcn@latest add @vivid-layer/install-command",
  bun: "bunx --bun shadcn@latest add @vivid-layer/install-command",
} satisfies InstallCommandCommands

export default function InstallCommandDemo() {
  return (
    <div className="flex h-72 w-full items-center justify-center p-6">
      <InstallCommand className="max-w-96" commands={commands} />
    </div>
  )
}
