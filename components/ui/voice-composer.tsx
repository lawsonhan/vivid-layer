"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  MicIcon,
  SquareIcon,
  XIcon,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Variants,
} from "motion/react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { LineWaveform } from "@/components/ui/line-waveform"
import { cn } from "@/lib/utils"

export type VoiceComposerErrorCode =
  | "unsupported"
  | "permission_denied"
  | "capture_failed"
  | "recognition_failed"
  | "transcription_failed"
  | "empty_transcript"

export type VoiceComposerError = {
  code: VoiceComposerErrorCode
  message: string
  cause?: unknown
}

export type VoiceComposerProps = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "onError"
> & {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (
    value: string,
    event: React.FormEvent<HTMLFormElement>,
  ) => void | Promise<void>
  onAudioRecorded?: (audio: Blob) => Promise<string>
  onTranscriptionChange?: (text: string) => void
  onError?: (error: VoiceComposerError) => void
  lang?: string
  disabled?: boolean
  maxDurationSeconds?: number
  waveformMode?: "static" | "scrolling"
}

type VoiceComposerPhase =
  | "idle"
  | "requesting"
  | "recording"
  | "transcribing"

type SelectionRange = {
  start: number
  end: number
}

type SpeechRecognitionAlternativeLike = {
  transcript: string
}

type SpeechRecognitionResultLike = {
  readonly isFinal: boolean
  readonly length: number
  readonly [index: number]: SpeechRecognitionAlternativeLike
}

type SpeechRecognitionResultListLike = {
  readonly length: number
  readonly [index: number]: SpeechRecognitionResultLike
}

type SpeechRecognitionEventLike = Event & {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultListLike
}

type SpeechRecognitionErrorEventLike = Event & {
  readonly error?: string
  readonly message?: string
}

type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onend: ((event: Event) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  abort: () => void
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

type VoiceStrategy =
  | {
      kind: "speech-recognition"
      Recognition: SpeechRecognitionConstructor
    }
  | {
      kind: "media-recorder"
      mimeType: string
    }

const RECORDER_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/ogg;codecs=opus",
  "audio/mp4",
] as const

class StaleVoiceStreamError extends Error {
  constructor() {
    super("Voice capture request is no longer active.")
    this.name = "StaleVoiceStreamError"
  }
}

const subscribeToHydration = () => () => undefined

const pageVariants: Variants = {
  textHidden: {
    opacity: 0,
    transition: { duration: 0.16, ease: "easeOut" },
    x: -20,
  },
  voiceHidden: {
    opacity: 0,
    transition: { duration: 0.16, ease: "easeOut" },
    x: 20,
  },
  center: {
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
    x: 0,
  },
}

function isChromiumSpeechBrowser() {
  if (typeof navigator === "undefined") {
    return false
  }

  const userAgentData = (
    navigator as Navigator & {
      userAgentData?: { brands?: Array<{ brand: string }> }
    }
  ).userAgentData
  const brands = userAgentData?.brands ?? []

  if (brands.length > 0) {
    return brands.some(({ brand }) =>
      /Google Chrome|Microsoft Edge/i.test(brand),
    )
  }

  return (
    /(?:Chrome|Edg)\//.test(navigator.userAgent) &&
    !/(?:OPR|Opera|SamsungBrowser)\//.test(navigator.userAgent)
  )
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined" || !isChromiumSpeechBrowser()) {
    return null
  }

  const recognitionWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }

  return (
    recognitionWindow.SpeechRecognition ??
    recognitionWindow.webkitSpeechRecognition ??
    null
  )
}

function getRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return null
  }

  for (const mimeType of RECORDER_MIME_TYPES) {
    try {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType
      }
    } catch {
      continue
    }
  }

  return null
}

function getVoiceStrategy(hasAudioRecorder: boolean): VoiceStrategy | null {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return null
  }

  const Recognition = getSpeechRecognitionConstructor()

  if (Recognition) {
    return { kind: "speech-recognition", Recognition }
  }

  if (!hasAudioRecorder) {
    return null
  }

  const mimeType = getRecorderMimeType()
  return mimeType ? { kind: "media-recorder", mimeType } : null
}

function isPermissionError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error.name === "NotAllowedError" || error.name === "SecurityError")
  )
}

function normalizeTranscript(value: string) {
  return value.trim()
}

function insertTranscript(
  value: string,
  transcript: string,
  selection: SelectionRange,
) {
  const start = Math.min(Math.max(selection.start, 0), value.length)
  const end = Math.min(Math.max(selection.end, start), value.length)
  const before = value.slice(0, start)
  const after = value.slice(end)
  const needsLeadingSpace =
    before.length > 0 &&
    !/\s$/.test(before) &&
    !/^[,.;:!?)}\]]/.test(transcript)
  const needsTrailingSpace =
    after.length > 0 &&
    !/^\s/.test(after) &&
    !/^[,.;:!?)}\]]/.test(after)
  const insertion = `${needsLeadingSpace ? " " : ""}${transcript}${
    needsTrailingSpace ? " " : ""
  }`

  return {
    caret: before.length + insertion.length,
    value: `${before}${insertion}${after}`,
  }
}

function VoiceComposer({
  className,
  disabled = false,
  lang = "en-US",
  maxDurationSeconds = 120,
  onAudioRecorded,
  onError,
  onSubmit,
  onTranscriptionChange,
  onValueChange,
  value,
  waveformMode = "scrolling",
  ...props
}: VoiceComposerProps) {
  const [phase, setPhase] = React.useState<VoiceComposerPhase>("idle")
  const [captureSession, setCaptureSession] = React.useState<number | null>(
    null,
  )
  const [announcement, setAnnouncement] = React.useState("")
  const isHydrated = React.useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  )
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const stopButtonRef = React.useRef<HTMLButtonElement>(null)
  const isComposingRef = React.useRef(false)
  const phaseRef = React.useRef<VoiceComposerPhase>("idle")
  const sessionRef = React.useRef(0)
  const mountedRef = React.useRef(false)
  const selectionRef = React.useRef<SelectionRange>({ start: 0, end: 0 })
  const pendingFocusRef = React.useRef<SelectionRange | null>(null)
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null)
  const recorderRef = React.useRef<MediaRecorder | null>(null)
  const acceptedStreamRef = React.useRef<MediaStream | null>(null)
  const recorderChunksRef = React.useRef<Blob[]>([])
  const finalTranscriptRef = React.useRef("")
  const recognitionStopRequestedRef = React.useRef(false)
  const timeoutRef = React.useRef<number | null>(null)
  const valueRef = React.useRef(value)
  const langRef = React.useRef(lang)
  const maxDurationRef = React.useRef(maxDurationSeconds)
  const onAudioRecordedRef = React.useRef(onAudioRecorded)
  const onErrorRef = React.useRef(onError)
  const onTranscriptionChangeRef = React.useRef(onTranscriptionChange)
  const onValueChangeRef = React.useRef(onValueChange)

  const setCurrentPhase = React.useCallback((next: VoiceComposerPhase) => {
    phaseRef.current = next
    if (mountedRef.current) {
      setPhase(next)
    }
  }, [])

  const clearRecordingTimeout = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const detachRecognition = React.useCallback(() => {
    const recognition = recognitionRef.current
    recognitionRef.current = null

    if (recognition) {
      recognition.onend = null
      recognition.onerror = null
      recognition.onresult = null
    }

    return recognition
  }, [])

  const detachRecorder = React.useCallback(() => {
    const recorder = recorderRef.current
    recorderRef.current = null
    recorderChunksRef.current = []

    if (recorder) {
      recorder.ondataavailable = null
      recorder.onerror = null
      recorder.onstop = null
    }

    return recorder
  }, [])

  const stopAcceptedStream = React.useCallback(() => {
    const stream = acceptedStreamRef.current
    acceptedStreamRef.current = null
    stream?.getTracks().forEach((track) => track.stop())
  }, [])

  const restoreTextFocus = React.useCallback((selection: SelectionRange) => {
    pendingFocusRef.current = selection
  }, [])

  const recoverWithError = React.useCallback(
    (error: VoiceComposerError, session = sessionRef.current) => {
      if (!mountedRef.current || session !== sessionRef.current) {
        return
      }

      sessionRef.current += 1
      clearRecordingTimeout()

      const recognition = detachRecognition()
      try {
        recognition?.abort()
      } catch {
        // The recognition service may already be inactive.
      }

      const recorder = detachRecorder()
      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop()
        } catch {
          // The recorder may have stopped between the state check and stop().
        }
      }

      stopAcceptedStream()

      finalTranscriptRef.current = ""
      recognitionStopRequestedRef.current = false
      setCaptureSession(null)
      restoreTextFocus(selectionRef.current)
      setCurrentPhase("idle")
      setAnnouncement(error.message)
      onErrorRef.current?.(error)
    },
    [
      clearRecordingTimeout,
      detachRecognition,
      detachRecorder,
      restoreTextFocus,
      setCurrentPhase,
      stopAcceptedStream,
    ],
  )

  const commitTranscript = React.useCallback(
    (rawTranscript: string, session: number) => {
      if (!mountedRef.current || session !== sessionRef.current) {
        return
      }

      const transcript = normalizeTranscript(rawTranscript)

      if (!transcript) {
        recoverWithError(
          {
            code: "empty_transcript",
            message: "No speech was detected.",
          },
          session,
        )
        return
      }

      clearRecordingTimeout()
      detachRecognition()
      detachRecorder()
      stopAcceptedStream()
      finalTranscriptRef.current = ""
      recognitionStopRequestedRef.current = false
      setCaptureSession(null)

      const result = insertTranscript(
        valueRef.current,
        transcript,
        selectionRef.current,
      )

      onTranscriptionChangeRef.current?.(transcript)
      onValueChangeRef.current(result.value)
      restoreTextFocus({ start: result.caret, end: result.caret })
      setCurrentPhase("idle")
      setAnnouncement("Voice transcription added.")
    },
    [
      clearRecordingTimeout,
      detachRecognition,
      detachRecorder,
      recoverWithError,
      restoreTextFocus,
      setCurrentPhase,
      stopAcceptedStream,
    ],
  )

  const startSpeechRecognition = React.useCallback(
    (
      Recognition: SpeechRecognitionConstructor,
      session: number,
    ) => {
      let recognition: SpeechRecognitionLike

      try {
        recognition = new Recognition()
      } catch (cause) {
        recoverWithError(
          {
            cause,
            code: "recognition_failed",
            message: "Speech recognition failed.",
          },
          session,
        )
        return
      }

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = langRef.current
      recognitionRef.current = recognition
      finalTranscriptRef.current = ""
      recognitionStopRequestedRef.current = false

      recognition.onresult = (event) => {
        if (session !== sessionRef.current) {
          return
        }

        for (
          let index = event.resultIndex;
          index < event.results.length;
          index += 1
        ) {
          const result = event.results[index]
          if (!result?.isFinal) {
            continue
          }

          const next = normalizeTranscript(result[0]?.transcript ?? "")
          if (next) {
            finalTranscriptRef.current = [
              finalTranscriptRef.current,
              next,
            ]
              .filter(Boolean)
              .join(" ")
          }
        }
      }

      recognition.onerror = (event) => {
        if (session !== sessionRef.current) {
          return
        }

        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          recoverWithError(
            {
              cause: event,
              code: "permission_denied",
              message: "Microphone permission was denied.",
            },
            session,
          )
          return
        }

        if (event.error === "audio-capture") {
          recoverWithError(
            {
              cause: event,
              code: "capture_failed",
              message: "Unable to capture microphone audio.",
            },
            session,
          )
          return
        }

        if (event.error === "no-speech") {
          recoverWithError(
            {
              cause: event,
              code: "empty_transcript",
              message: "No speech was detected.",
            },
            session,
          )
          return
        }

        recoverWithError(
          {
            cause: event,
            code: "recognition_failed",
            message: event.message || "Speech recognition failed.",
          },
          session,
        )
      }

      recognition.onend = () => {
        if (session !== sessionRef.current) {
          return
        }

        if (!recognitionStopRequestedRef.current) {
          recoverWithError(
            {
              code: "recognition_failed",
              message: "Speech recognition ended unexpectedly.",
            },
            session,
          )
          return
        }

        setCurrentPhase("transcribing")
        setAnnouncement("Transcribing audio.")
        commitTranscript(finalTranscriptRef.current, session)
      }

      try {
        recognition.start()
        setCurrentPhase("recording")
        setAnnouncement("Recording. Press Stop when you are finished.")
      } catch (cause) {
        recoverWithError(
          {
            cause,
            code: "recognition_failed",
            message: "Speech recognition failed.",
          },
          session,
        )
      }
    },
    [
      commitTranscript,
      recoverWithError,
      setCurrentPhase,
    ],
  )

  const startMediaRecorder = React.useCallback(
    (stream: MediaStream, mimeType: string, session: number) => {
      let recorder: MediaRecorder

      try {
        recorder = new MediaRecorder(stream, { mimeType })
      } catch (cause) {
        recoverWithError(
          {
            cause,
            code: "capture_failed",
            message: "Unable to capture microphone audio.",
          },
          session,
        )
        return
      }

      recorderRef.current = recorder
      recorderChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (session === sessionRef.current && event.data.size > 0) {
          recorderChunksRef.current.push(event.data)
        }
      }

      recorder.onerror = (event) => {
        recoverWithError(
          {
            cause: event,
            code: "capture_failed",
            message: "Unable to capture microphone audio.",
          },
          session,
        )
      }

      recorder.onstop = () => {
        if (!mountedRef.current || session !== sessionRef.current) {
          return
        }

        const blob = new Blob(recorderChunksRef.current, { type: mimeType })
        recorderRef.current = null
        recorderChunksRef.current = []

        if (blob.size === 0) {
          recoverWithError(
            {
              code: "empty_transcript",
              message: "No speech was detected.",
            },
            session,
          )
          return
        }

        const transcribe = onAudioRecordedRef.current
        if (!transcribe) {
          recoverWithError(
            {
              code: "transcription_failed",
              message: "Audio transcription failed.",
            },
            session,
          )
          return
        }

        void Promise.resolve()
          .then(() => transcribe(blob))
          .then(
            (transcript) => {
              commitTranscript(
                typeof transcript === "string" ? transcript : "",
                session,
              )
            },
            (cause) => {
              recoverWithError(
                {
                  cause,
                  code: "transcription_failed",
                  message: "Audio transcription failed.",
                },
                session,
              )
            },
          )
      }

      try {
        recorder.start()
        setCurrentPhase("recording")
        setAnnouncement("Recording. Press Stop when you are finished.")
      } catch (cause) {
        recoverWithError(
          {
            cause,
            code: "capture_failed",
            message: "Unable to capture microphone audio.",
          },
          session,
        )
      }
    },
    [
      commitTranscript,
      recoverWithError,
      setCurrentPhase,
    ],
  )

  const handleStreamReady = React.useCallback(
    (stream: MediaStream) => {
      if (
        !mountedRef.current ||
        captureSession === null ||
        captureSession !== sessionRef.current ||
        phaseRef.current !== "requesting" ||
        acceptedStreamRef.current !== null
      ) {
        stream.getTracks().forEach((track) => track.stop())

        // LineWaveform calls onStreamReady before creating its AudioContext.
        // Throw after closing a late stream so that stale async setup cannot
        // continue; the paired onError callback ignores this internal signal.
        throw new StaleVoiceStreamError()
      }

      const strategy = getVoiceStrategy(
        Boolean(onAudioRecordedRef.current),
      )
      const session = captureSession
      acceptedStreamRef.current = stream

      if (!strategy) {
        recoverWithError(
          {
            code: "unsupported",
            message: "Voice input is not supported in this browser.",
          },
          session,
        )
        return
      }

      // LineWaveform finishes its AudioContext setup immediately after this
      // callback returns. Starting capture in the next microtask keeps the
      // composer in `requesting` long enough to surface setup failures while
      // still rejecting any duplicate or late stream for this session.
      void Promise.resolve().then(() => {
        if (
          !mountedRef.current ||
          session !== sessionRef.current ||
          phaseRef.current !== "requesting" ||
          acceptedStreamRef.current !== stream
        ) {
          return
        }

        if (strategy.kind === "speech-recognition") {
          startSpeechRecognition(strategy.Recognition, session)
          return
        }

        startMediaRecorder(stream, strategy.mimeType, session)
      })
    },
    [
      captureSession,
      recoverWithError,
      startMediaRecorder,
      startSpeechRecognition,
    ],
  )

  const handleWaveformError = React.useCallback(
    (error: Error | React.SyntheticEvent<HTMLDivElement>) => {
      if (
        error instanceof StaleVoiceStreamError ||
        !mountedRef.current ||
        captureSession === null ||
        captureSession !== sessionRef.current ||
        phaseRef.current !== "requesting"
      ) {
        return
      }

      const cause =
        typeof error === "object" &&
        error !== null &&
        "name" in error
          ? error
          : new Error("Unable to capture microphone audio.", {
              cause: error,
            })
      const permissionDenied = isPermissionError(cause)
      recoverWithError({
        cause,
        code: permissionDenied ? "permission_denied" : "capture_failed",
        message: permissionDenied
          ? "Microphone permission was denied."
          : "Unable to capture microphone audio.",
      })
    },
    [captureSession, recoverWithError],
  )

  const stopRecording = React.useCallback(() => {
    if (phaseRef.current !== "recording") {
      return
    }

    const session = sessionRef.current
    clearRecordingTimeout()
    setCurrentPhase("transcribing")
    setAnnouncement("Transcribing audio.")

    const recognition = recognitionRef.current
    if (recognition) {
      try {
        recognitionStopRequestedRef.current = true
        recognition.stop()
        stopAcceptedStream()
      } catch (cause) {
        recoverWithError(
          {
            cause,
            code: "recognition_failed",
            message: "Speech recognition failed.",
          },
          session,
        )
      }
      return
    }

    const recorder = recorderRef.current
    if (recorder) {
      try {
        recorder.stop()
        stopAcceptedStream()
      } catch (cause) {
        recoverWithError(
          {
            cause,
            code: "capture_failed",
            message: "Unable to capture microphone audio.",
          },
          session,
        )
      }
      return
    }

    recoverWithError(
      {
        code: "capture_failed",
        message: "Unable to capture microphone audio.",
      },
      session,
    )
  }, [
    clearRecordingTimeout,
    recoverWithError,
    setCurrentPhase,
    stopAcceptedStream,
  ])

  const cancelRecording = React.useCallback(() => {
    if (
      phaseRef.current !== "requesting" &&
      phaseRef.current !== "recording"
    ) {
      return
    }

    sessionRef.current += 1
    clearRecordingTimeout()

    const recognition = detachRecognition()
    try {
      recognition?.abort()
    } catch {
      // The recognition service may already be inactive.
    }

    const recorder = detachRecorder()
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop()
      } catch {
        // The recorder may have stopped between the state check and stop().
      }
    }

    stopAcceptedStream()

    finalTranscriptRef.current = ""
    recognitionStopRequestedRef.current = false
    setCaptureSession(null)
    restoreTextFocus(selectionRef.current)
    setCurrentPhase("idle")
    setAnnouncement("Voice recording canceled.")
  }, [
    clearRecordingTimeout,
    detachRecognition,
    detachRecorder,
    restoreTextFocus,
    setCurrentPhase,
    stopAcceptedStream,
  ])

  const beginVoiceInput = React.useCallback(() => {
    if (disabled || phaseRef.current !== "idle") {
      return
    }

    const strategy = getVoiceStrategy(Boolean(onAudioRecordedRef.current))
    if (!strategy) {
      recoverWithError({
        code: "unsupported",
        message: "Voice input is not supported in this browser.",
      })
      return
    }

    const textarea = textareaRef.current
    const currentValue = valueRef.current
    selectionRef.current = {
      start: textarea?.selectionStart ?? currentValue.length,
      end: textarea?.selectionEnd ?? currentValue.length,
    }
    sessionRef.current += 1
    setCaptureSession(sessionRef.current)
    finalTranscriptRef.current = ""
    recognitionStopRequestedRef.current = false
    recorderChunksRef.current = []
    setCurrentPhase("requesting")
    setAnnouncement("Requesting microphone access.")
  }, [disabled, recoverWithError, setCurrentPhase])

  React.useEffect(() => {
    valueRef.current = value
    langRef.current = lang
    maxDurationRef.current = maxDurationSeconds
    onAudioRecordedRef.current = onAudioRecorded
    onErrorRef.current = onError
    onTranscriptionChangeRef.current = onTranscriptionChange
    onValueChangeRef.current = onValueChange
  }, [
    lang,
    maxDurationSeconds,
    onAudioRecorded,
    onError,
    onTranscriptionChange,
    onValueChange,
    value,
  ])

  React.useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      sessionRef.current += 1
      clearRecordingTimeout()

      const recognition = detachRecognition()
      try {
        recognition?.abort()
      } catch {
        // The recognition service may already be inactive.
      }

      const recorder = detachRecorder()
      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop()
        } catch {
          // The recorder may have stopped between the state check and stop().
        }
      }
      stopAcceptedStream()
    }
  }, [
    clearRecordingTimeout,
    detachRecognition,
    detachRecorder,
    stopAcceptedStream,
  ])

  React.useEffect(() => {
    if (phase !== "recording") {
      return
    }

    clearRecordingTimeout()
    const duration = Math.max(0, maxDurationRef.current) * 1000
    timeoutRef.current = window.setTimeout(stopRecording, duration)

    return clearRecordingTimeout
  }, [clearRecordingTimeout, phase, stopRecording])

  React.useEffect(() => {
    if (phase !== "recording") {
      return
    }

    stopButtonRef.current?.focus()
  }, [phase])

  React.useEffect(() => {
    if (phase !== "idle" || !pendingFocusRef.current) {
      return
    }

    const selection = pendingFocusRef.current
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    const max = textarea.value.length
    const start = Math.min(selection.start, max)
    const end = Math.min(Math.max(selection.end, start), max)
    textarea.focus()
    textarea.setSelectionRange(start, end)
    pendingFocusRef.current = null
  }, [phase, value])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (disabled || phaseRef.current !== "idle" || !value.trim()) {
      return
    }

    void onSubmit(value, event)
  }

  const isVoicePage = phase === "recording" || phase === "transcribing"
  const isRequesting = phase === "requesting"
  const waveformActive = phase === "requesting" || phase === "recording"
  const voiceStrategy = isHydrated
    ? getVoiceStrategy(Boolean(onAudioRecorded))
    : null

  return (
    <MotionConfig reducedMotion="user">
      <form
        aria-busy={phase === "requesting" || phase === "transcribing"}
        className={cn("w-full", className)}
        data-phase={phase}
        data-slot="voice-composer"
        onSubmit={handleSubmit}
        {...props}
      >
        <InputGroup className="min-h-24 flex-col items-stretch rounded-3xl">
          <div
            className="relative h-14 w-full shrink-0 overflow-clip"
            data-slot="voice-composer-body"
          >
            <motion.div
              animate={isVoicePage ? "textHidden" : "center"}
              aria-hidden={isVoicePage}
              className="absolute inset-0 flex h-14 w-full"
              data-slot="voice-composer-text"
              initial={false}
              inert={isVoicePage}
              variants={pageVariants}
            >
              <InputGroupTextarea
                aria-busy={isRequesting || undefined}
                aria-label="Message"
                className="h-14 min-h-14 max-h-14 overflow-y-auto px-4 pt-3 text-base"
                disabled={disabled}
                name="message"
                onChange={(event) =>
                  onValueChange(event.currentTarget.value)
                }
                onCompositionEnd={() => {
                  isComposingRef.current = false
                }}
                onCompositionStart={() => {
                  isComposingRef.current = true
                }}
                onKeyDown={(event) => {
                  if (
                    event.key !== "Enter" ||
                    event.shiftKey ||
                    isComposingRef.current ||
                    event.nativeEvent.isComposing
                  ) {
                    return
                  }

                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }}
                placeholder="Ask anything"
                readOnly={isRequesting}
                ref={textareaRef}
                rows={2}
                value={value}
              />
            </motion.div>

            <AnimatePresence initial={false}>
              {phase !== "idle" ? (
                <motion.div
                  animate={isVoicePage ? "center" : "voiceHidden"}
                  aria-hidden={!isVoicePage}
                  className="absolute inset-0 flex h-14 w-full items-center px-4"
                  data-slot="voice-composer-voice"
                  exit="voiceHidden"
                  initial="voiceHidden"
                  inert={!isVoicePage}
                  key="voice"
                  variants={pageVariants}
                >
                  {captureSession !== null ? (
                    <LineWaveform
                      active={waveformActive}
                      aria-hidden="true"
                      className="text-foreground"
                      data-slot="voice-composer-waveform"
                      height={44}
                      key={captureSession}
                      mode={waveformMode}
                      onError={handleWaveformError}
                      onStreamReady={handleStreamReady}
                      processing={phase === "transcribing"}
                    />
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <InputGroupAddon
            align="block-end"
            className="grid h-10 min-h-10 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-2 py-0"
          >
            <div
              className="flex min-w-0 items-center"
              data-slot="voice-composer-leading-action"
            >
              {isVoicePage ? (
                phase === "transcribing" ? (
                  <InputGroupText className="min-w-0 truncate px-2">
                    Transcribing…
                  </InputGroupText>
                ) : (
                  <InputGroupButton
                    onClick={cancelRecording}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <XIcon aria-hidden="true" data-icon="inline-start" />
                    Cancel
                  </InputGroupButton>
                )
              ) : (
                <InputGroupButton
                  aria-busy={isRequesting || undefined}
                  aria-disabled={isRequesting || undefined}
                  aria-label="Use voice input"
                  disabled={disabled || !voiceStrategy}
                  onClick={beginVoiceInput}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <MicIcon aria-hidden="true" data-icon="inline-start" />
                  Voice
                </InputGroupButton>
              )}
            </div>

            <div
              className="flex size-8 shrink-0 items-center justify-center"
              data-slot="voice-composer-trailing-action"
            >
              {isVoicePage ? (
                phase === "recording" ? (
                  <InputGroupButton
                    aria-label="Stop recording"
                    onClick={stopRecording}
                    ref={stopButtonRef}
                    size="icon-sm"
                    title="Stop recording"
                    type="button"
                    variant="default"
                  >
                    <SquareIcon aria-hidden="true" />
                  </InputGroupButton>
                ) : null
              ) : (
                <InputGroupButton
                  aria-disabled={isRequesting || undefined}
                  aria-label="Send message"
                  disabled={disabled || !value.trim()}
                  size="icon-sm"
                  type="submit"
                  variant="default"
                >
                  <ArrowUpIcon aria-hidden="true" />
                </InputGroupButton>
              )}
            </div>
          </InputGroupAddon>
        </InputGroup>
      </form>
      <span aria-atomic="true" className="sr-only" role="status">
        {announcement}
      </span>
    </MotionConfig>
  )
}

export { VoiceComposer }
