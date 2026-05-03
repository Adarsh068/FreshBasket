"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Leaf, RotateCcw, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

function formatMessage(text: string) {
  const lines = text.split("\n")
  return lines.map((line, i) => {
    const boldLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    if (boldLine.trim().startsWith("- ") || boldLine.trim().startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2 my-1">
          <span className="text-green-500 mt-0.5 shrink-0 text-base">•</span>
          <span dangerouslySetInnerHTML={{ __html: boldLine.replace(/^[\s\-•]+/, "") }} />
        </div>
      )
    }
    if (/^\d+\./.test(boldLine.trim())) {
      return (
        <div key={i} className="flex gap-2 my-1">
          <span dangerouslySetInnerHTML={{ __html: boldLine }} />
        </div>
      )
    }
    if (!boldLine.trim()) return <div key={i} className="h-2" />
    return (
      <div key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: boldLine }} />
    )
  })
}

const SUGGESTIONS = [
  { emoji: "🍎", label: "Apple" },
  { emoji: "🥭", label: "Mango" },
  { emoji: "🥦", label: "Broccoli" },
  { emoji: "🥕", label: "Carrot" },
  { emoji: "🍌", label: "Banana" },
  { emoji: "🍅", label: "Tomato" },
  { emoji: "🍊", label: "Orange" },
  { emoji: "🥔", label: "Potato" },
]

export function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm **FreshBasket AI** 🧺\n\nAsk me about any fruit or vegetable — I'll tell you its **calories, nutrition, and health benefits**!\n\nTry typing: *apple*, *mango*, *broccoli*... 🍎🥦",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: "user", content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? data.error ?? "Something went wrong." },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Could not connect. Make sure GROQ_API_KEY is set in .env.local and restart npm run dev." },
      ])
    }
    setLoading(false)
  }

  function reset() {
    setMessages([{
      role: "assistant",
      content: "Hi! I'm **FreshBasket AI** 🧺\n\nAsk me about any fruit or vegetable — I'll tell you its **calories, nutrition, and health benefits**!\n\nTry typing: *apple*, *mango*, *broccoli*... 🍎🥦",
    }])
    setInput("")
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open FreshBasket AI Chat"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all hover:scale-110"
        style={{ boxShadow: "0 8px 32px rgba(220,38,38,0.4)" }}
      >
        {open
          ? <X className="h-7 w-7" />
          : <MessageCircle className="h-7 w-7" />
        }
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl border border-border bg-background shadow-2xl"
          style={{
            width: "420px",
            height: "620px",
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "calc(100vh - 120px)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.22)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-2xl bg-primary px-5 py-4 text-white shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-2xl">
              🌿
            </div>
            <div className="flex-1">
              <div className="font-bold text-base flex items-center gap-2">
                FreshBasket AI
                <Sparkles className="h-4 w-4 text-yellow-300" />
              </div>
              <div className="text-xs text-white/70">Nutrition & Health Assistant · Powered by Groq</div>
            </div>
            <button onClick={reset} title="Clear chat"
              className="rounded-lg p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm mt-1">
                    🌿
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold mt-1">
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm">
                  🌿
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-muted px-5 py-4">
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map((j) => (
                      <span key={j} className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce inline-block"
                        style={{ animationDelay: `${j * 0.15}s` }} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3 shrink-0">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Quick picks:</p>
              <div className="grid grid-cols-4 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.label.toLowerCase())}
                    className="flex flex-col items-center gap-1 rounded-xl border border-border bg-muted/50 px-2 py-2.5 text-xs font-medium hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border px-4 py-3 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage() }}
              className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2.5 focus-within:border-primary focus-within:bg-background transition-colors"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any fruit or vegetable..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-40 transition-opacity hover:bg-primary/90"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              🔒 Your queries are private · FreshBasket AI
            </p>
          </div>
        </div>
      )}
    </>
  )
}