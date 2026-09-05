"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type DraftEmail = {
  from: string
  to: string
  subject: string
  body: string
}

type DraftEmailCardProps = Omit<
  React.ComponentProps<"form">,
  "children" | "onSubmit"
> & {
  value: DraftEmail
  onValueChange: (value: DraftEmail) => void
  onSend: (value: DraftEmail) => void
  /** Renders the Discard action; omit it to offer only Send email. */
  onDiscard?: () => void
  /** Locks the fields and both actions, e.g. while a send is in flight. */
  disabled?: boolean
}

const fieldClassName =
  "grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] items-start gap-2 p-4 sm:grid-cols-[5rem_minmax(0,1fr)]"

const labelClassName =
  "flex w-full items-center pt-1 text-xs leading-[1.5] font-semibold tracking-wider text-muted-foreground uppercase"

const textareaClassName =
  "min-h-6 resize-none rounded-none border-0 bg-transparent px-0 py-0 text-base leading-6 [overflow-wrap:anywhere] focus-visible:ring-0 md:text-base dark:bg-transparent"

function DraftEmailCard({
  value,
  onValueChange,
  onSend,
  onDiscard,
  disabled,
  className,
  ...props
}: DraftEmailCardProps) {
  const fieldId = React.useId()
  const toId = `${fieldId}-to`
  const subjectId = `${fieldId}-subject`
  const bodyId = `${fieldId}-body`

  function updateDraft(
    key: keyof DraftEmail,
    nextValue: string,
  ) {
    onValueChange({ ...value, [key]: nextValue })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (disabled) return

    onSend(value)
  }

  return (
    <form
      aria-label="Draft email"
      {...props}
      data-slot="draft-email-card"
      data-disabled={disabled || undefined}
      className={cn("min-w-0", className)}
      onSubmit={handleSubmit}
    >
      <div
        data-slot="draft-email-card-surface"
        className="overflow-hidden rounded-2xl bg-card text-card-foreground shadow-sm ring-1 ring-foreground/10"
      >
        <div
          className={fieldClassName}
          data-slot="draft-email-card-field"
          data-field="from"
        >
          <span data-slot="draft-email-card-label" className={labelClassName}>
            From
          </span>
          <p
            data-slot="draft-email-card-value"
            className="min-w-0 break-words text-base leading-6 text-muted-foreground"
            dir="auto"
          >
            {value.from}
          </p>
        </div>

        <Separator />

        <div
          className={fieldClassName}
          data-slot="draft-email-card-field"
          data-field="to"
        >
          <label
            data-slot="draft-email-card-label"
            className={labelClassName}
            htmlFor={toId}
          >
            To
          </label>
          <Textarea
            id={toId}
            name="email.to"
            autoCapitalize="none"
            autoComplete="email"
            className={textareaClassName}
            dir="auto"
            disabled={disabled}
            inputMode="email"
            onChange={(event) =>
              updateDraft("to", event.currentTarget.value)
            }
            placeholder="name@example.com"
            required
            spellCheck={false}
            value={value.to}
          />
        </div>

        <Separator />

        <div
          className={fieldClassName}
          data-slot="draft-email-card-field"
          data-field="subject"
        >
          <label
            data-slot="draft-email-card-label"
            className={labelClassName}
            htmlFor={subjectId}
          >
            Subject
          </label>
          <Textarea
            id={subjectId}
            name="email.subject"
            className={textareaClassName}
            dir="auto"
            disabled={disabled}
            onChange={(event) =>
              updateDraft("subject", event.currentTarget.value)
            }
            placeholder="Email subject"
            required
            value={value.subject}
          />
        </div>

        <Separator />

        <div
          className="min-w-0 p-4"
          data-slot="draft-email-card-field"
          data-field="body"
        >
          <label
            data-slot="draft-email-card-label"
            className="sr-only"
            htmlFor={bodyId}
          >
            Body
          </label>
          <Textarea
            id={bodyId}
            name="email.body"
            className={cn(textareaClassName, "min-h-[13.5rem]")}
            dir="auto"
            disabled={disabled}
            onChange={(event) =>
              updateDraft("body", event.currentTarget.value)
            }
            placeholder="Write your message…"
            required
            value={value.body}
          />
        </div>
      </div>

      <div
        data-slot="draft-email-card-actions"
        className="mt-4 flex flex-wrap items-center gap-2"
      >
        <Button
          type="submit"
          size="lg"
          className="rounded-full px-4"
          disabled={disabled}
        >
          Send email
        </Button>
        {onDiscard ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-full px-4"
            disabled={disabled}
            onClick={onDiscard}
          >
            Discard
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export {
  DraftEmailCard,
  type DraftEmail,
  type DraftEmailCardProps,
}
