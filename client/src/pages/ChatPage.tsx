import ChatList from "../components/ChatList"
import ChatWindow from "../components/ChatWindow"


const ChatPage = () => {
  return (
    <section className="border-2 w-full h-[calc(100vh-4rem)] flex items-center justify-between">
        <ChatList />
        <ChatWindow />
    </section>
  )
}

export default ChatPage
