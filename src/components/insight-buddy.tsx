import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Send, Sparkles, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
}

export interface InsightBuddyProps {
  examplePrompts?: Array<string>
  /** When true, renders as a FAB + fixed overlay (analytics page).
   *  When false (default), renders as a sticky in-flow panel (profile page). */
  floating?: boolean
}

// ---------------------------------------------------------------------------
// Canned responses
// ---------------------------------------------------------------------------

const TERM1_WA_RESPONSE = `Here's a summary for **Sec 4 EL-G3, Term 1 WA**:

• **Students who sat:** 120
• **Students with distinction** (A1/A2): 42 (35%)
• **Students with pass** (A1–C6): 98 (82%)

**Compared to the past:**
• Distinction rate is up from ~30% in the previous year's EOY — a positive trend 📈
• Pass rate held steady at around 80–83% across terms
• ~18 students (15%) did not pass — consider targeted support for this group`

const CHART_QUESTION_RESPONSE = `Happy to help explain! Which chart are you looking at?

You can:
• **Type the chart name** (e.g. "Scores by class")
• **Paste a screenshot** directly into the chat`

const SCORES_BY_CLASS_RESPONSE = `Here's what the **Scores by class** chart shows:

**Key insights:**
• **4A leads** with the highest median (~74) and a compact spread — students perform consistently
• **4B** sits at median ~68 with moderate spread across the class
• **4C** has a wide IQR, indicating high variance — some students may need extra support
• **4D has the lowest median** (~57) and widest spread — consider differentiated instruction

**Reading the chart:**
• Blue box = middle 50% of students (IQR, Q1–Q3)
• Blue vertical line = median score
• Whiskers = min / max scores

**Takeaway:** 4A is the strongest cohort for EL-G3 Term 1 WA. 4D would benefit most from targeted intervention.`

const GENERIC_RESPONSE = `I'm here to help with analytics questions. Try asking about student performance, grade distributions, or trends — or paste a chart screenshot for an explanation.`

function getBotResponse(
  text: string,
  imageUrl: string | undefined,
  history: Array<Message>,
): string {
  const lower = text.toLowerCase()
  const lastAssistant = [...history]
    .reverse()
    .find((m) => m.role === 'assistant')
  const prevAskedAboutChart = lastAssistant?.content.includes(
    'Which chart are you looking at?',
  )

  // Image pasted → always explain Scores by class (demo)
  if (imageUrl) {
    return SCORES_BY_CLASS_RESPONSE
  }

  // After asking about the chart, user types the chart name
  if (
    prevAskedAboutChart &&
    (lower.includes('score') ||
      lower.includes('class') ||
      lower.includes('box'))
  ) {
    return SCORES_BY_CLASS_RESPONSE
  }

  // "How did Sec 4 (EL-G3) do for Term 1 WA?"
  if (
    lower.includes('term 1') ||
    lower.includes('term1') ||
    lower.includes('term 1 wa')
  ) {
    return TERM1_WA_RESPONSE
  }

  // "What does this chart mean?"
  if (
    lower.includes('chart') ||
    lower.includes('what does') ||
    lower.includes('graph')
  ) {
    return CHART_QUESTION_RESPONSE
  }

  return GENERIC_RESPONSE
}

// ---------------------------------------------------------------------------
// Simple inline markdown renderer (handles **bold** and line breaks)
// ---------------------------------------------------------------------------

function parseInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-0.5 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />
        return <div key={i}>{parseInline(line)}</div>
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared chat panel content
// ---------------------------------------------------------------------------

interface PanelContentProps {
  messages: Array<Message>
  examplePrompts: Array<string>
  input: string
  setInput: (v: string) => void
  pendingImage: string | null
  setPendingImage: (v: string | null) => void
  sendMessage: (text: string, imageUrl?: string) => void
  onClose?: () => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

function PanelContent({
  messages,
  examplePrompts,
  input,
  setInput,
  pendingImage,
  setPendingImage,
  sendMessage,
  onClose,
  messagesEndRef,
  fileInputRef,
}: PanelContentProps) {
  const isEmpty = messages.length === 0

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData.items
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          setPendingImage(URL.createObjectURL(file))
          e.preventDefault()
        }
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input.trim(), pendingImage ?? undefined)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPendingImage(URL.createObjectURL(file))
      e.target.value = ''
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Insight Buddy</p>
            <p className="text-[10px] leading-tight text-muted-foreground">
              Analytics assistant
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages / empty state */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {isEmpty ? (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-muted-foreground">
              Ask me anything about your data, or try:
            </p>
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-left text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 active:scale-[0.98]"
              >
                {prompt}
              </button>
            ))}
            {examplePrompts.length === 0 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Ask about student performance,
                <br />
                grade distributions, or trends.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2',
                  msg.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Sparkles className="h-3 w-3 text-blue-600" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3 py-2 text-xs',
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-blue-600 text-white'
                      : 'rounded-tl-sm bg-muted/70 text-foreground',
                  )}
                >
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="screenshot"
                      className="mb-2 max-w-full rounded-lg"
                    />
                  )}
                  <MessageContent content={msg.content} />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t bg-white p-3">
        {/* Pending image preview */}
        {pendingImage && (
          <div className="relative mb-2 inline-block">
            <img
              src={pendingImage}
              alt="preview"
              className="h-14 w-14 rounded-lg border object-cover"
            />
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 text-white hover:bg-gray-700"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        )}

        {/* Textarea — full width, clearly visible */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your data… (Shift+Enter for new line)"
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />

        {/* Action row */}
        <div className="mt-2 flex items-center justify-between">
          {/* Hidden file input + attach button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            title="Attach image"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Attach image
          </button>

          {/* Send button */}
          <Button
            type="button"
            onClick={() => sendMessage(input.trim(), pendingImage ?? undefined)}
            size="sm"
            disabled={!input.trim() && !pendingImage}
            className="h-7 gap-1.5 bg-blue-600 px-3 text-xs hover:bg-blue-700 disabled:opacity-40"
          >
            Send
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// InsightBuddy
// ---------------------------------------------------------------------------

export function InsightBuddy({
  examplePrompts = [],
  floating = false,
}: InsightBuddyProps) {
  const [messages, setMessages] = useState<Array<Message>>([])
  const [input, setInput] = useState('')
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false) // only used in floating mode
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(text: string, imageUrl?: string) {
    if (!text.trim() && !imageUrl) return

    const userMsg: Message = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: text,
      imageUrl,
    }

    const botResponse = getBotResponse(text, imageUrl, messages)
    const assistantMsg: Message = {
      id: `${Date.now()}-a`,
      role: 'assistant',
      content: botResponse,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
    setPendingImage(null)
  }

  const panelProps: PanelContentProps = {
    messages,
    examplePrompts,
    input,
    setInput,
    pendingImage,
    setPendingImage,
    sendMessage,
    messagesEndRef,
    fileInputRef,
  }

  // ── Floating mode: FAB + fixed overlay ─────────────────────────────────────
  if (floating) {
    return (
      <>
        {/* FAB */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all',
            isOpen
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          )}
          title={isOpen ? 'Close Insight Buddy' : 'Open Insight Buddy'}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </button>

        {/* Overlay panel */}
        {isOpen && (
          <div className="fixed bottom-[72px] right-6 z-40 flex h-[min(560px,calc(100vh-6rem))] w-80 flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
            <PanelContent {...panelProps} onClose={() => setIsOpen(false)} />
          </div>
        )}
      </>
    )
  }

  // ── Sticky mode: in-flow panel (student profile) ────────────────────────────
  return (
    <div className="sticky top-6 flex h-[calc(100vh-3rem)] w-72 shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <PanelContent {...panelProps} />
    </div>
  )
}
