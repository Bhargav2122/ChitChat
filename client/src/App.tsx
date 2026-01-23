import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer  } from "react-toastify";

const ChatPage = lazy(() => import ("./pages/ChatPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const App = () => {
  return (
    <BrowserRouter>
      <main className="min-h-screen w-screen bg-sky-100">
        <Navbar />
        <Suspense fallback={<div className="flex justify-center items-center top-1/2">Loading...</div>}>
          <Routes>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Suspense>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      </main>
    </BrowserRouter>
  );
};

export default App;
