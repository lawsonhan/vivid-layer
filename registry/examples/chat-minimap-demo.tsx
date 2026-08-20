"use client"

import { Fragment } from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  ChatMinimap,
  type ChatMinimapItem,
  type ChatMinimapProps,
} from "@/components/ui/chat-minimap"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { cn } from "@/lib/utils"

const turns = [
  {
    id: "vis-brief",
    title: "Review the incident handoff and tell me what to read first.",
    description: "Start with the summary and the impact section. The regression affected the upload queue, but the recovery path completed for every queued job.",
  },
  {
    id: "vis-impact",
    title: "What was the customer impact?",
    description: "Impact was limited to delayed processing.\n\nNo records were dropped, and the reconciliation worker confirmed each retry batch. Support saw confusion from two customers, but there were no checkout or billing errors.",
  },
  {
    id: "vis-actions",
    title: "What actions are open?",
    description: "Keep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.",
  },
  {
    id: "vis-checklist",
    title: "Give me the follow-up checklist.",
    description: "After that, compare the queue recovery graph with the deploy timeline so the handoff shows exactly when processing returned to baseline. That makes it easier for support and engineering to answer the same customer questions without re-reading the whole incident thread.\n\nI would also add a short owner note beside each follow-up item. The checklist is small, but ownership keeps the retry-window decision, alert tuning, and support macro from drifting into separate follow-up conversations.\n\nKeep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.",
  },
  {
    id: "vis-timeline",
    title: "When did processing return to normal?",
    description: "The queue began draining at 14:22 UTC and returned to baseline at 14:47 UTC.\n\nThe deploy completed earlier, but the recovery graph is the better marker because it shows when customer-visible delays actually ended.",
  },
  {
    id: "vis-owners",
    title: "Who owns the remaining follow-ups?",
    description: "Mina owns the queue-depth alert, Rafael owns the retry-window decision, and Support Operations owns the customer macro.\n\nEach item should stay in the same incident project until it has an owner, due date, and verification note.",
  },
  {
    id: "vis-support",
    title: "What should support tell customers?",
    description: "Tell customers that uploads were delayed but not lost. Every queued job completed after retries, and no checkout or billing data was affected.\n\nIf a customer still sees a pending upload, ask for the job ID so engineering can compare it with the reconciliation log.",
  },
  {
    id: "vis-cause",
    title: "What caused the queue to back up?",
    description: "A worker concurrency change increased the number of uploads entering the retry path at the same time. The queue accepted the work, but processors could not drain it at the expected rate.\n\nThe issue was amplified by a retry window that stayed open longer than intended.",
  },
  {
    id: "vis-detection",
    title: "How did we first detect the regression?",
    description: "The first reliable signal was a rise in queue age, followed by two support reports about uploads remaining in a processing state. Error rate stayed low, so the normal failure alert did not fire.\n\nQueue age should become a primary incident signal for this workflow.",
  },
  {
    id: "vis-alert",
    title: "Why did the existing alert arrive late?",
    description: "The alert watched failed jobs rather than delayed jobs. Retries kept completing successfully, which hid the growing wait time until the queue crossed its broad capacity threshold.\n\nA latency-based alert would have detected the incident earlier.",
  },
  {
    id: "vis-regions",
    title: "Were all regions affected equally?",
    description: "The largest delay appeared in the primary region because it handled most upload traffic. Secondary regions saw shorter queues and recovered before the primary region returned to baseline.\n\nNo regional failover was required.",
  },
  {
    id: "vis-volume",
    title: "How large did the backlog become?",
    description: "The queue peaked at 18,420 pending jobs, compared with a normal peak below 2,000. Median processing delay reached eleven minutes and the longest delay reached twenty-seven minutes.\n\nThe backlog began shrinking immediately after concurrency was reduced.",
  },
  {
    id: "vis-retries",
    title: "Did retries make the incident worse?",
    description: "Retries protected the jobs from being dropped, but the extended retry window increased pressure on the workers. The system repeatedly reconsidered work that would have completed after capacity recovered.\n\nThe follow-up is to cap retry concurrency without weakening delivery guarantees.",
  },
  {
    id: "vis-integrity",
    title: "How did we verify data integrity?",
    description: "Engineering compared accepted upload IDs with completed job IDs and then checked the reconciliation ledger for gaps. Every accepted record had a matching completion or retry event.\n\nA second pass after recovery confirmed zero missing or duplicated records.",
  },
  {
    id: "vis-rollback",
    title: "Why did we not roll back immediately?",
    description: "The deployment also contained a schema change that made an immediate rollback riskier than reducing worker concurrency. The mitigation could be applied independently and showed a measurable queue improvement within minutes.\n\nRollback remained available if the queue stopped draining.",
  },
  {
    id: "vis-mitigation",
    title: "Which mitigation had the biggest effect?",
    description: "Reducing worker concurrency stabilized database pressure and allowed successful jobs to finish without competing with aggressive retries. Shortening the retry window then accelerated the remaining recovery.\n\nTogether, those changes returned throughput above incoming traffic volume.",
  },
  {
    id: "vis-deploy",
    title: "What changed in the recovery deploy?",
    description: "The recovery deploy restored the previous concurrency limit and added a guard that pauses retry expansion when queue age rises. It also emitted queue-age metrics at one-minute intervals.\n\nNo customer-facing API or payload changed.",
  },
  {
    id: "vis-validation",
    title: "How was the recovery deploy validated?",
    description: "The team replayed a production-shaped upload batch in staging, then deployed to five percent of workers. Queue age, completion rate, retry volume, and database saturation stayed within the expected range.\n\nThe rollout expanded only after two clean observation windows.",
  },
  {
    id: "vis-risk",
    title: "What risk remains after the fix?",
    description: "A sudden traffic spike can still create a short queue because worker capacity is intentionally capped. The difference is that retry pressure can no longer grow without bound.\n\nThe remaining risk is delay, not loss, and it is now visible through queue-age monitoring.",
  },
  {
    id: "vis-monitoring",
    title: "What should we monitor for the next day?",
    description: "Watch queue age, pending job count, retry concurrency, completion throughput, and database saturation. Compare each metric with the same traffic window from the previous week.\n\nEscalate if queue age exceeds five minutes for more than ten consecutive minutes.",
  },
  {
    id: "vis-thresholds",
    title: "Which alert thresholds should we use?",
    description: "Create a warning when queue age exceeds three minutes for five minutes, and a critical alert at five minutes for ten minutes. Add a separate warning when retry concurrency remains above eighty percent of its cap.\n\nThese thresholds favor sustained degradation over brief traffic spikes.",
  },
  {
    id: "vis-dashboard",
    title: "What belongs on the incident dashboard?",
    description: "Place queue age, queue depth, incoming jobs, completed jobs, retries, and worker concurrency on the first row. Add database saturation and regional breakdowns below them.\n\nAnnotate deploys and mitigation changes so metric movement can be tied to specific actions.",
  },
  {
    id: "vis-logs",
    title: "Which logs should we preserve?",
    description: "Preserve worker scaling decisions, retry-window changes, queue snapshots, reconciliation output, and deploy annotations for the full incident window. Include fifteen minutes before the first signal and thirty minutes after recovery.\n\nThat range is sufficient for the postmortem without retaining unrelated customer content.",
  },
  {
    id: "vis-segments",
    title: "Which customers experienced the longest delays?",
    description: "Customers submitting large multi-file batches during the peak window experienced the longest waits. Single-file uploads generally completed during the first retry cycle.\n\nAccount tier did not affect processing order or recovery time.",
  },
  {
    id: "vis-sla",
    title: "Did the incident breach an SLA?",
    description: "The public availability SLA was not breached because uploads remained accepted and eventually completed. Two internal processing-time objectives were missed during the peak window.\n\nThe postmortem should report both misses even though they do not trigger service credits.",
  },
  {
    id: "vis-comms",
    title: "When should we send the customer update?",
    description: "Send the resolved update after the reconciliation report and one full monitoring window are complete. The message should include the impact window, confirmation that uploads were not lost, and the current system status.\n\nAvoid publishing internal implementation details that do not help customers recover.",
  },
  {
    id: "vis-escalation",
    title: "What should trigger another escalation?",
    description: "Escalate if queue age rises for three consecutive intervals, completed throughput falls below incoming volume, or reconciliation reports any unmatched upload ID. A second customer report after recovery should also reopen the incident.\n\nEach trigger has a named owner in the monitoring handoff.",
  },
  {
    id: "vis-dependencies",
    title: "Are any external services part of the follow-up?",
    description: "No external provider caused the incident, but the storage latency panel should remain in the dashboard as a comparison signal. The database team will review connection saturation during retry bursts.\n\nAll required fixes remain within systems owned by the upload platform team.",
  },
  {
    id: "vis-deadlines",
    title: "What are the follow-up deadlines?",
    description: "The queue-age alert and dashboard update are due tomorrow. Retry concurrency controls are due before the next scheduled deploy, and the full load test is due by the end of the week.\n\nThe postmortem draft should be ready within three business days.",
  },
  {
    id: "vis-postmortem",
    title: "What should the postmortem focus on?",
    description: "Focus on why successful retries masked customer-visible latency, why queue age was not a primary alert, and how the concurrency change passed pre-deploy checks. Separate detection, mitigation, and prevention actions.\n\nThe review should improve system controls rather than assign individual blame.",
  },
  {
    id: "vis-summary",
    title: "Summarize the final operational state.",
    description: "The upload queue is at baseline, all accepted jobs have completed, and reconciliation shows no data loss or duplication. Worker concurrency and retry limits are stable under current traffic.\n\nMonitoring remains elevated until the next deploy and all follow-up work is tracked in the incident project.",
  },
  {
    id: "vis-closeout",
    title: "What should I verify before closing the incident?",
    description: "Confirm that queue depth remains at baseline, the retry window has been disabled after the deploy, and the reconciliation report still shows zero dropped records.\n\nThen link the alert, owner notes, and support macro from the incident summary so the final handoff has one source of truth.",
  },
] as const satisfies readonly ChatMinimapItem[]

type ChatMinimapDemoProps = {
  minimapProps?: Pick<
    ChatMinimapProps,
    | "side"
    | "magnification"
    | "lensRange"
    | "itemSize"
    | "gap"
    | "pillWidth"
    | "transitionDuration"
    | "easing"
  >
}

export default function ChatMinimapDemo({
  minimapProps,
}: ChatMinimapDemoProps = {}) {
  const minimapOnRight = minimapProps?.side === "right"

  return (
    <MessageScrollerProvider scrollMargin={12}>
      <div className="flex h-[42rem] w-full items-center justify-center p-4 sm:p-6">
        <div
          className={cn(
            "grid h-[36rem] w-full max-w-2xl overflow-hidden rounded-xl bg-background",
            minimapOnRight
              ? "grid-cols-[minmax(0,1fr)_4rem]"
              : "grid-cols-[4rem_minmax(0,1fr)]"
          )}
        >
          <ChatMinimap
            items={turns}
            className={cn(
              "row-start-1 self-center justify-self-center",
              minimapOnRight ? "col-start-2" : "col-start-1"
            )}
            {...minimapProps}
          />
          <MessageScroller
            className={cn(
              "row-start-1",
              minimapOnRight ? "col-start-1" : "col-start-2"
            )}
          >
            <MessageScrollerViewport>
              <MessageScrollerContent className="p-4 sm:p-6">
                {turns.map(({ id, title, description }) => (
                  <Fragment key={id}>
                    <TranscriptMessage
                      id={id}
                      role="user"
                      text={title}
                    />
                    <TranscriptMessage
                      id={`${id}-response`}
                      role="assistant"
                      text={description}
                    />
                  </Fragment>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

function TranscriptMessage({
  id,
  role,
  text,
}: {
  id: string
  role: "user" | "assistant"
  text: string
}) {
  const isUserMessage = role === "user"

  return (
    <MessageScrollerItem
      messageId={id}
      scrollAnchor={isUserMessage}
    >
      <Message align={isUserMessage ? "end" : "start"}>
        <MessageContent>
          <Bubble variant={isUserMessage ? "default" : "ghost"}>
            <BubbleContent className="flex flex-col gap-2">
              {text.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}
