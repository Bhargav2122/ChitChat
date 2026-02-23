import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import { lazy, Suspense } from "react"
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./components/ProtectedRoute";

const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"))
const ChatPage = lazy(() => import("./pages/ChatPage"))


const App = () => {
  return (
    <BrowserRouter>
     <main  className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden">
      <Suspense fallback={<div>loading....</div>  } >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>}   />
        </Routes>
      </Suspense>
      </div>
      <ToastContainer />
     </main>
    </BrowserRouter>
  )
}

export default App
