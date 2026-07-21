'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'How does group buying work?',
  "What's the delivery minimum?",
  'How do I join a cluster?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      const token = localStorage.getItem('accessToken')
      if (token) headers.Authorization = `Bearer ${token}`

      const res = await fetch(`${API_URL}/api/chatbot/message/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-10),
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: body.response }])
      } else {
        setError(body.error || body.detail || "Sorry, I couldn't answer that just now.")
      }
    } catch {
      setError('Something went wrong reaching the assistant. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open quick questions chat'}
        className="fixed bottom-6 right-6 z-50 bg-aj-yellow text-aj-dark w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-yellow-400 transition"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-gray-100">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-900 text-white">
            <div>
              <p className="font-bold text-sm">AgroBridge Quick Questions</p>
              <p className="text-xs text-gray-300">Ask anything about how it works</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  👋 Hi! Ask me anything about cluster buying, pricing, delivery, or the AI Planner.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left text-sm text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-yellow-50 hover:border-aj-yellow border border-gray-200 rounded-xl px-3 py-2 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-aj-yellow text-aj-dark rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-sm px-3 py-2 text-sm flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a question..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-aj-yellow"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-aj-yellow text-aj-dark w-9 h-9 rounded-xl flex items-center justify-center hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
