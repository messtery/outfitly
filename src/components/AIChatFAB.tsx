import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, CirclePlus } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item"
import { cartService } from "../services/CartService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

const MAIN_PATHS = ["/menu", "/cart", "/profile"]

let nextId = 2

type Message = {
  id: number
  role: "user" | "assistant"
  text: string
  type?: "text" | "action"
  itemId?: string
}

export default function AIChatFAB() {
  const location = useLocation()
  const fabPosition = MAIN_PATHS.includes(location.pathname)
    ? "bottom-20 right-4"
    : "bottom-4 right-4"

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", text: "Hi! I'm your AI assistant. How can I help you today?" },
  ])
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  const createChat = (message: string) => {
    fetch(`http://localhost:3000/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setMessages((prev) => [...prev, { id: nextId++, role: "assistant", text: res.data.message }])
        renderActions(res.data.actions)
      })
  }

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: nextId++, role: "user", text: trimmed }])
    setMessage("")
    createChat(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderActions = (actions: any[]) => {
    if (actions.length === 0) return

    actions.map((action) => {
      setMessages((prev) => [...prev, { id: nextId++, role: "assistant", text: action.label, type: "action", itemId: action.item_id }])
    })
  }

  const handleSuggestionClick = (e: React.MouseEvent<HTMLAnchorElement>, productId: string) => {
    const el = e.currentTarget;
    el.style.transition = 'opacity 0.5s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);

    cartService
      .addToCart(productId)
      .then(() => {
        toast.success("Item added to cart", {
          description: "Check your cart for more details",
          action: {
            label: "View Cart",
            onClick: () => {
              navigate("/cart")
            }
          }
        })
      });
  }

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className={`fixed ${fabPosition} z-50 w-80 rounded-2xl shadow-2xl border bg-white dark:bg-black flex flex-col overflow-hidden`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-500 to-blue-500">
            <div className="flex items-center gap-2 text-white">
              <Bot className="w-5 h-5" />
              <span className="font-semibold text-sm">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors hover:cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-72">
            {messages.map((msg: Message) =>
              msg.type === "action"
                ? (
                    <Item className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`} variant="outline" size="sm" asChild onClick={(e) => handleSuggestionClick(e, msg.itemId)}>
                      <a href="#">
                        <ItemContent>
                          <ItemTitle>{msg.text}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <CirclePlus />
                        </ItemActions>
                      </a>
                    </Item>
                )
                : (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${msg.role === "user"
                        ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2 border-t dark:border-gray-800">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white disabled:opacity-40 hover:cursor-pointer transition-opacity"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed ${fabPosition} z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg flex items-center justify-center hover:cursor-pointer hover:scale-105 active:scale-95 transition-transform`}
        aria-label="Open AI chat"
      >
        <Bot className="w-6 h-6" />
      </button>
    </>
  )
}
