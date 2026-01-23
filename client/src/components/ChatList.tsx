import { useAppSelector } from "../app/hooks"


const ChatList = () => {
  const { user } = useAppSelector((s) => s.auth);
    
  return (
<aside className="w-1/3 h-full flex flex-col bg-red-600">
    <div className="flex flex-col items-center justify-center w-full bg-amber-300">
        <p className="text-2xl">Chats</p>
        <input type="search" placeholder="search friend" className="border w-full rounded-2xl p-2 mb-1" />
    </div>
    <section className="flex py-3.5 px-1.5 h-full bg-amber-50 flex-col items-center">
        <div className=" w-full flex items-center p-1.5">
            <img src={user?.profilePic}  className="w-10 h-10 rounded-full" alt="" />
           <div className="ml-2">
             <span>Bhargav</span>
             <p>ajsncjdncjdnvj</p>
           </div>
        </div>
    </section>
</aside>
  )
}

export default ChatList
