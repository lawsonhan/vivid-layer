"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CornerDownLeftIcon,
  PencilIcon,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  resize,
  useIsPresent,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type PlanComposerOption = {
  value: string
  label: string
  description: string
}

type PlanComposerQuestion = {
  id: string
  title: string
  options: PlanComposerOption[]
}

type PlanComposerAnswer =
  | { type: "option"; value: string }
  | { type: "note"; value: string }

type PlanComposerAnswers = Record<string, PlanComposerAnswer>

type PlanComposerProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  notePlaceholder?: string
  onCancel?: () => void
  onComplete?: (answers: PlanComposerAnswers) => void
  onOpenChange?: (open: boolean) => void
  onSubmit?: (message: string) => void
  open: boolean
  promptPlaceholder?: string
  questions: PlanComposerQuestion[]
}

/* -------------------------------------------------------------------------- */
/*                                  Session                                   */
/* -------------------------------------------------------------------------- */

type Direction = 1 | -1

type PlanSession = {
  answers: PlanComposerAnswers
  direction: Direction
  drafts: Record<string, string>
  editing: boolean
  index: number
}

type PlanAction =
  | { type: "go-to"; index: number }
  | { type: "select-option"; value: string }
  | { type: "edit-note"; value: string }
  | { type: "submit-note" }
  | { type: "edit-answers" }

const initialPlanSession: PlanSession = {
  answers: {},
  direction: 1,
  drafts: {},
  editing: false,
  index: 0,
}

function advance(
  session: PlanSession,
  questions: PlanComposerQuestion[],
  answer: PlanComposerAnswer,
): PlanSession {
  const question = questions[session.index]
  const answers = { ...session.answers, [question.id]: answer }

  if (questions.every((item) => item.id in answers)) {
    return { ...session, answers, direction: 1, editing: false }
  }

  const index =
    session.index < questions.length - 1
      ? session.index + 1
      : questions.findIndex((item) => !(item.id in answers))

  return {
    ...session,
    answers,
    direction: index > session.index ? 1 : -1,
    editing: false,
    index,
  }
}

function planReducer(
  session: PlanSession,
  action: PlanAction,
  questions: PlanComposerQuestion[],
): PlanSession {
  const question = questions[session.index]

  switch (action.type) {
    case "go-to":
      return {
        ...session,
        direction: action.index > session.index ? 1 : -1,
        index: action.index,
      }

    case "select-option":
      return advance(
        {
          ...session,
          drafts: { ...session.drafts, [question.id]: "" },
        },
        questions,
        { type: "option", value: action.value },
      )

    case "edit-note":
      return {
        ...session,
        drafts: { ...session.drafts, [question.id]: action.value },
      }

    case "submit-note": {
      const note = (session.drafts[question.id] ?? "").trim()

      return note
        ? advance(session, questions, { type: "note", value: note })
        : session
    }

    case "edit-answers":
      return { ...session, direction: -1, editing: true }
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Motion                                   */
/* -------------------------------------------------------------------------- */

const modeEnter: Transition = { duration: 0.26, ease: "easeOut" }
const modeExit: Transition = { duration: 0.22, ease: "easeIn" }
const stepEnter: Transition = { duration: 0.18, ease: "easeOut" }
const stepExit: Transition = { duration: 0.1, ease: "easeIn" }
const surfaceTransition: Transition = { duration: 0.26, ease: "easeOut" }

const modeVariants: Variants = {
  enter: (direction: Direction) => ({
    filter: "blur(4px)",
    opacity: 0,
    transition: modeEnter,
    y: direction * 16,
  }),
  center: {
    filter: "blur(0px)",
    opacity: 1,
    transition: modeEnter,
    y: 0,
  },
  exit: (direction: Direction) => ({
    filter: "blur(4px)",
    opacity: 0,
    transition: modeExit,
    y: direction * -16,
  }),
}

const stepVariants: Variants = {
  enter: (direction: Direction) => ({
    filter: "blur(4px)",
    opacity: 0,
    transition: stepEnter,
    x: direction * 48,
  }),
  center: {
    filter: "blur(0px)",
    opacity: 1,
    transition: stepEnter,
    x: 0,
  },
  exit: (direction: Direction) => ({
    filter: "blur(4px)",
    opacity: 0,
    transition: stepExit,
    x: direction * -48,
  }),
}

type PresencePageProps = React.ComponentProps<typeof motion.div>

const PresencePage = React.forwardRef<HTMLDivElement, PresencePageProps>(
  function PresencePage({ children, ...props }, ref) {
    const isPresent = useIsPresent()

    return (
      <motion.div ref={ref} {...props} inert={!isPresent}>
        {children}
      </motion.div>
    )
  },
)

/* -------------------------------------------------------------------------- */
/*                                    Parts                                   */
/* -------------------------------------------------------------------------- */

// The animated surface owns the chrome; InputGroup owns control spacing.
const embeddedInputGroupClassName =
  "h-[52px] rounded-none border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-transparent"

function PlanComposerBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground shadow-xs",
        className,
      )}
      {...props}
    />
  )
}

type PlanComposerHeaderProps = {
  children?: React.ReactNode
  title: string
}

function PlanComposerHeader({ children, title }: PlanComposerHeaderProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4">
      <p className="truncate text-base leading-5 font-medium">{title}</p>
      {children}
    </div>
  )
}

type ComposerInputProps = {
  onPromptChange: (value: string) => void
  placeholder: string
  prompt: string
}

function ComposerInput({
  onPromptChange,
  placeholder,
  prompt,
}: ComposerInputProps) {
  const isComposingRef = React.useRef(false)

  return (
    <InputGroup
      className={embeddedInputGroupClassName}
      data-plan-composer="input"
    >
      <InputGroupInput
        aria-label="Message"
        className="h-full pl-6"
        name="message"
        onChange={(event) => onPromptChange(event.target.value)}
        onCompositionEnd={() => {
          isComposingRef.current = false
        }}
        onCompositionStart={() => {
          isComposingRef.current = true
        }}
        onKeyDown={(event) => {
          if (
            event.key !== "Enter" ||
            isComposingRef.current ||
            event.nativeEvent.isComposing
          ) {
            return
          }

          event.preventDefault()
          event.currentTarget.form?.requestSubmit()
        }}
        placeholder={placeholder}
        value={prompt}
      />
      <InputGroupAddon
        align="inline-end"
        className="pr-3.5 has-[>button]:mr-0"
      >
        <InputGroupButton
          aria-label="Send message"
          className="rounded-full"
          disabled={!prompt.trim()}
          size="icon-sm"
          type="submit"
          variant="default"
        >
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

type PlanNoteFieldProps = {
  note: string
  onNoteChange: (value: string) => void
  onSubmit: () => void
  placeholder: string
}

function PlanNoteField({
  note,
  onNoteChange,
  onSubmit,
  placeholder,
}: PlanNoteFieldProps) {
  const isComposingRef = React.useRef(false)

  return (
    <InputGroup
      className={embeddedInputGroupClassName}
      data-plan-composer="note"
    >
      <InputGroupInput
        aria-label="Answer current question"
        className="h-full"
        name="note"
        onChange={(event) => onNoteChange(event.target.value)}
        onCompositionEnd={() => {
          isComposingRef.current = false
        }}
        onCompositionStart={() => {
          isComposingRef.current = true
        }}
        onKeyDown={(event) => {
          if (
            event.key !== "Enter" ||
            isComposingRef.current ||
            event.nativeEvent.isComposing
          ) {
            return
          }

          event.preventDefault()
          onSubmit()
        }}
        placeholder={placeholder}
        value={note}
      />
      <InputGroupAddon className="pl-6">
        <PlanComposerBadge aria-hidden="true">
          <PencilIcon className="size-3.5" />
        </PlanComposerBadge>
      </InputGroupAddon>
      <InputGroupAddon
        align="inline-end"
        className="pr-3.5 has-[>button]:mr-0"
      >
        <InputGroupButton
          aria-label="Submit note"
          className="rounded-full"
          disabled={!note.trim()}
          onClick={onSubmit}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <CornerDownLeftIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

type PlanQuestionPageProps = {
  index: number
  note: string
  notePlaceholder: string
  onNavigate: (index: number) => void
  onNoteChange: (value: string) => void
  onSelect: (value: string) => void
  onSubmitNote: () => void
  question: PlanComposerQuestion
  selectedValue: string | null
  total: number
}

function PlanQuestionPage({
  index,
  note,
  notePlaceholder,
  onNavigate,
  onNoteChange,
  onSelect,
  onSubmitNote,
  question,
  selectedValue,
  total,
}: PlanQuestionPageProps) {
  function pagerButton(delta: -1 | 1) {
    const target = index + delta
    const Icon = delta === -1 ? ChevronLeftIcon : ChevronRightIcon

    return (
      <Button
        aria-label={delta === -1 ? "Previous question" : "Next question"}
        className="size-6 rounded-full disabled:opacity-30"
        disabled={target < 0 || target >= total}
        onClick={() => onNavigate(target)}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <Icon />
      </Button>
    )
  }

  return (
    <div data-slot="plan-composer-question">
      <div className="px-4 pt-4">
        <PlanComposerHeader title={question.title}>
          {total > 1 && (
            <div
              aria-label="Question navigation"
              className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
              role="group"
            >
              {pagerButton(-1)}
              <span>
                Question {index + 1} of {total}
              </span>
              {pagerButton(1)}
            </div>
          )}
        </PlanComposerHeader>

        <div
          aria-label={question.title}
          className="mt-3 flex min-w-0 flex-col gap-1 overflow-hidden"
          role="group"
        >
          {question.options.map((option, optionIndex) => (
            <button
              aria-current={
                selectedValue === option.value ? "true" : undefined
              }
              className="flex h-10 w-full min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-full px-2 py-1.5 text-left text-sm transition-colors outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 data-[selected=true]:bg-muted"
              data-selected={selectedValue === option.value}
              key={option.value}
              onClick={() => onSelect(option.value)}
              type="button"
            >
              <PlanComposerBadge>{optionIndex + 1}</PlanComposerBadge>
              <span className="flex min-w-0 flex-1 items-baseline gap-2 overflow-hidden">
                <span className="shrink-0 font-medium">{option.label}</span>
                <span className="min-w-0 truncate text-[13px] text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <PlanNoteField
        note={note}
        onNoteChange={onNoteChange}
        onSubmit={onSubmitNote}
        placeholder={notePlaceholder}
      />
    </div>
  )
}

function answerLabel(
  question: PlanComposerQuestion,
  answer: PlanComposerAnswer,
) {
  if (answer.type === "note") {
    return answer.value
  }

  return (
    question.options.find((option) => option.value === answer.value)?.label ??
    answer.value
  )
}

type PlanReceiptPageProps = {
  answers: PlanComposerAnswers
  onCancel: () => void
  onEdit: () => void
  onSubmit: () => void
  questions: PlanComposerQuestion[]
}

function PlanReceiptPage({
  answers,
  onCancel,
  onEdit,
  onSubmit,
  questions,
}: PlanReceiptPageProps) {
  return (
    <div
      aria-label="Plan ready"
      data-slot="plan-composer-receipt"
      role="region"
    >
      <div className="px-4 pt-4">
        <PlanComposerHeader title="Plan ready">
          <Button
            className="h-6 rounded-full px-1.5 text-xs text-muted-foreground"
            onClick={onEdit}
            size="xs"
            type="button"
            variant="ghost"
          >
            <ChevronLeftIcon data-icon="inline-start" />
            Edit answers
          </Button>
        </PlanComposerHeader>

        <div className="mt-3 flex flex-col">
          {questions.map((question) => (
            <div
              className="flex min-w-0 flex-col gap-0.5 border-t border-border/60 py-2 first:border-t-0 first:pt-0"
              key={question.id}
            >
              <span className="truncate text-xs text-muted-foreground">
                {question.title}
              </span>
              <span className="truncate text-sm font-medium">
                {answerLabel(question, answers[question.id])}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-label="Plan actions"
        className="flex h-[52px] items-center justify-end gap-2 px-4"
        role="group"
      >
        <Button
          className="h-9 rounded-full px-4"
          onClick={onCancel}
          size="lg"
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="h-9 rounded-full px-4"
          onClick={onSubmit}
          size="lg"
          type="button"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Plan Flow                                 */
/* -------------------------------------------------------------------------- */

type PlanFlowProps = {
  notePlaceholder: string
  onCancel?: () => void
  onComplete?: (answers: PlanComposerAnswers) => void
  onOpenChange?: (open: boolean) => void
  questions: PlanComposerQuestion[]
}

function PlanFlow({
  notePlaceholder,
  onCancel,
  onComplete,
  onOpenChange,
  questions,
}: PlanFlowProps) {
  const [session, dispatch] = React.useReducer(
    (current: PlanSession, action: PlanAction) =>
      planReducer(current, action, questions),
    initialPlanSession,
  )

  const question = questions[session.index]
  const answer = session.answers[question.id]
  const isReceipt =
    questions.every((item) => item.id in session.answers) && !session.editing

  return (
    <div
      className="relative w-full"
      data-slot="plan-composer-plan"
    >
      <AnimatePresence
        custom={session.direction}
        initial={false}
        mode="wait"
      >
        <PresencePage
          animate="center"
          className="w-full"
          custom={session.direction}
          data-slot="plan-composer-step"
          exit="exit"
          initial="enter"
          key={isReceipt ? "receipt" : question.id}
          variants={stepVariants}
        >
          {isReceipt ? (
            <PlanReceiptPage
              answers={session.answers}
              onCancel={() => {
                onCancel?.()
                onOpenChange?.(false)
              }}
              onEdit={() => dispatch({ type: "edit-answers" })}
              onSubmit={() => {
                onComplete?.(session.answers)
                onOpenChange?.(false)
              }}
              questions={questions}
            />
          ) : (
            <PlanQuestionPage
              index={session.index}
              note={session.drafts[question.id] ?? ""}
              notePlaceholder={notePlaceholder}
              onNavigate={(index) => dispatch({ type: "go-to", index })}
              onNoteChange={(value) => dispatch({ type: "edit-note", value })}
              onSelect={(value) => dispatch({ type: "select-option", value })}
              onSubmitNote={() => dispatch({ type: "submit-note" })}
              question={question}
              selectedValue={answer?.type === "option" ? answer.value : null}
              total={questions.length}
            />
          )}
        </PresencePage>
      </AnimatePresence>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

function PlanComposer({
  className,
  notePlaceholder = "Answer in your own words",
  onCancel,
  onComplete,
  onOpenChange,
  onSubmit,
  open,
  promptPlaceholder = "Ask anything",
  questions,
  ...props
}: PlanComposerProps) {
  const [prompt, setPrompt] = React.useState("")
  const [surfaceHeight, setSurfaceHeight] = React.useState<number | "auto">(
    "auto",
  )
  const shouldReduceMotion = useReducedMotion()
  const showPlan = open && questions.length > 0
  const modeDirection: Direction = showPlan ? 1 : -1
  const sessionKey = questions.map((question) => question.id).join(" ")

  const measureRef = React.useCallback((element: HTMLDivElement | null) => {
    if (!element) {
      return
    }

    return resize(element, (_, { height }) => {
      // Include the shell's 1px top and bottom border.
      setSurfaceHeight(height + 2)
    })
  }, [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (showPlan) {
      return
    }

    const message = prompt.trim()

    if (!message) {
      return
    }

    onSubmit?.(message)
    setPrompt("")
  }

  return (
    <MotionConfig reducedMotion="user">
      <form
        className={cn(
          "relative h-[52px] w-[min(720px,calc(100vw-32px))]",
          className,
        )}
        data-slot="plan-composer"
        onSubmit={handleSubmit}
        {...props}
      >
        <motion.div
          animate={{ height: surfaceHeight }}
          className="absolute inset-x-0 bottom-0 overflow-hidden rounded-3xl border border-input bg-popover shadow-xl shadow-black/8 transition-[border-color,box-shadow] has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50"
          initial={false}
          transition={
            shouldReduceMotion ? { duration: 0 } : surfaceTransition
          }
        >
          <div ref={measureRef}>
            <AnimatePresence
              custom={modeDirection}
              initial={false}
              mode="popLayout"
            >
              {showPlan ? (
                <PresencePage
                  animate="center"
                  className="relative w-full"
                  custom={modeDirection}
                  data-slot="plan-composer-mode"
                  exit="exit"
                  initial="enter"
                  key={`plan:${sessionKey}`}
                  variants={modeVariants}
                >
                  <PlanFlow
                    notePlaceholder={notePlaceholder}
                    onCancel={onCancel}
                    onComplete={onComplete}
                    onOpenChange={onOpenChange}
                    questions={questions}
                  />
                </PresencePage>
              ) : (
                <PresencePage
                  animate="center"
                  className="relative w-full"
                  custom={modeDirection}
                  data-slot="plan-composer-composer"
                  exit="exit"
                  initial="enter"
                  key="composer"
                  variants={modeVariants}
                >
                  <ComposerInput
                    onPromptChange={setPrompt}
                    placeholder={promptPlaceholder}
                    prompt={prompt}
                  />
                </PresencePage>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </form>
    </MotionConfig>
  )
}

export {
  PlanComposer,
  type PlanComposerAnswer,
  type PlanComposerAnswers,
  type PlanComposerOption,
  type PlanComposerProps,
  type PlanComposerQuestion,
}
