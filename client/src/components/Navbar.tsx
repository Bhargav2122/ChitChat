import { Link } from "react-router-dom"


const Navbar = () => {
  return (
    <nav className="w-full h-16 px-3 bg-gray-800  text-white shadow-2xl flex justify-between items-center">
        <div className="text-2xl font-bold">Chit Chat</div>
        <div className=" text-lg flex items-center justify-between gap-8">
            <Link to='/login' className="">Login</Link>
            <Link to='/profile' className=""><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESDF5lzpQCIPfmm6aa8GuCNeq6A73-0dQ5w&s"
            alt="profile"
             className="w-10 h-10 rounded-full"
            />
            </Link>
        </div>
    </nav>
  )
}

export default Navbar
