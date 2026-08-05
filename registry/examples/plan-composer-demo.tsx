"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  PlanComposer,
  type PlanComposerQuestion,
} from "@/components/ui/plan-composer"

const planComposerDemoQuestions: PlanComposerQuestion[] = [
  {
    id: "rendering",
    title: "How should a small marketing site render?",
    options: [
      {
        value: "static",
        label: "Static generation",
        description: "Build pages ahead of time.",
      },
      {
        value: "server",
        label: "Server rendering",
        description: "Generate HTML for each request.",
      },
      {
        value: "client",
        label: "Client rendering",
        description: "Render pages in the browser.",
      },
    ],
  },
  {
    id: "content",
    title: "Where should the copy live?",
    options: [
      {
        value: "cms",
        label: "Hosted CMS",
        description: "Edit without a deploy.",
      },
      {
        value: "repo",
        label: "Markdown in the repo",
        description: "Review copy alongside code.",
      },
    ],
  },
  {
    id: "deployment",
    title: "Where should the site be deployed?",
    options: [
      {
        value: "vercel",
        label: "Vercel",
        description: "Deploy with zero-config previews.",
      },
      {
        value: "cloudflare",
        label: "Cloudflare",
        description: "Run close to users at the edge.",
      },
      {
        value: "netlify",
        label: "Netlify",
        description: "Use a managed web platform.",
      },
      {
        value: "self-hosted",
        label: "Self-hosted",
        description: "Keep it on your own machines.",
      },
    ],
  },
]

export default function PlanComposerDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-[28rem] w-full flex-col items-center justify-end gap-4 p-4 sm:p-6">
      <PlanComposer
        aria-label="Plan composer"
        notePlaceholder="No, and tell Codex what to do differently"
        onOpenChange={setOpen}
        open={open}
        promptPlaceholder="Ask Codex to do anything"
        questions={planComposerDemoQuestions}
      />

      {/*
        Demo only, and below the composer on purpose: plan mode is controlled,
        so in a real app this is your agent deciding it needs clarification.
        There is no trigger inside the component and none is installed with it.
        The panel also grows upward out of the composer, so anything placed
        above would end up underneath it.
      */}
      <Button
        onClick={() => setOpen(!open)}
        size="sm"
        type="button"
        variant="outline"
      >
        {open ? "End plan" : "Start plan"}
      </Button>
    </div>
  )
}

export { planComposerDemoQuestions }
