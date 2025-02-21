import { ChatHeader } from "../ChatHeader"
import { WelcomeMessage } from "../WelcomeMessage"
import { ChatInterface } from "../ChatInterface"

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 animate-gradiant">
      <ChatHeader />
      <main className="pt-24 px-4 pb-8">
        <WelcomeMessage username="Satya" />
        <ChatInterface />
      </main>
    </div>
  )
}

export default ChatPage