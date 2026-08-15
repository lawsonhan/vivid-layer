"use client"

import { useState } from "react"

import {
  DraftEmailCard,
  type DraftEmail,
} from "@/components/ui/draft-email-card"

const draftEmailCardDemoValue = {
  from: "studio@vividlayer.dev",
  to: "maya@northstar.studio",
  subject: "Follow-up on the product review",
  body: `Hi Maya,

Thanks for walking us through the new direction today. The refined hierarchy and calmer interaction model feel much closer to the experience we want to ship.

I have attached our consolidated notes to the project and highlighted the two decisions we should close before Friday.

Best,
The Vivid Layer team`,
} as const satisfies DraftEmail

export default function DraftEmailCardDemo() {
  const [draft, setDraft] = useState<DraftEmail>(draftEmailCardDemoValue)

  return (
    <div className="flex min-h-[36rem] w-full items-center justify-center p-4 sm:p-10">
      <DraftEmailCard
        className="w-full max-w-[35rem]"
        value={draft}
        onValueChange={setDraft}
        onSend={() => undefined}
        onDiscard={() => setDraft(draftEmailCardDemoValue)}
      />
    </div>
  )
}

export { draftEmailCardDemoValue }
