import { useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your NC HCI-CDS AI Assistant. I can help you with:\n\n• Participant eligibility screening\n• Care plan creation\n• Form generation\n• Policy guidance\n• ARMS database queries\n\nWhat would you like help with today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickActions = [
    'Check participant eligibility',
    'Create new care plan',
    'Generate DA-101 form',
    'Review care advisor requirements',
    'Calculate service budget'
  ]

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'general_assistance',
          userId: 'demo-user',
          context: {
            message: input,
            conversationHistory: messages
          }
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: JSON.stringify(data.guidance, null, 2),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI request failed:', error)
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="mt-2 text-gray-600">
          Multi-agent AI system for HCI-CDS guidance and automation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && (
                        <Bot className="w-5 h-5 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 animate-pulse" />
                      <span className="text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about HCI-CDS..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">AI Capabilities</h2>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>✓ Policy interpretation</li>
              <li>✓ Form generation</li>
              <li>✓ Eligibility checking</li>
              <li>✓ Care plan assistance</li>
              <li>✓ ARMS integration</li>
              <li>✓ Compliance guidance</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Session Info</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Messages:</span> {messages.length}</p>
              <p><span className="font-medium">Model:</span> Claude Sonnet 4</p>
              <p><span className="font-medium">Status:</span> Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
