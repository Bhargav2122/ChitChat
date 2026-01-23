import { Link } from "react-router-dom"
import { useAppSelector } from "../app/hooks"


const Navbar = () => {
  const { user } = useAppSelector((s) => s.auth)

  return (
    <nav className="w-full h-16 px-3   text-shadow-slate-950 border-2 shadow-2xl flex justify-between items-center">
        <div className="text-2xl font-bold">Chit Chat</div>
        <div className=" text-lg flex items-center justify-between gap-8">
          {user ? (
            <>
             <Link to='/profile' className=""><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESDF5lzpQCIPfmm6aa8GuCNeq6A73-0dQ5w&s"
            alt="profile"
             className="w-10 h-10 rounded-full"
            />
            </Link>
            </>
          ) : (
            <>
            <Link to='/login' className="">Login</Link>
            </>
          )
          
          }
            
            
        </div>
    </nav>
  )
}

export default Navbar
