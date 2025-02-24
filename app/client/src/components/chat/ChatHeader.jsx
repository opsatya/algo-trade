import { History, User, MessageSquare, Settings, Bell } from "lucide-react"

export const ChatHeader = () => {
  return (
    <div className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
           
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Cancerian capital
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <History className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <User className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

