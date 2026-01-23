import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import {
  LoginSchema,
  type LoginInput,
} from "../validation/authValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { signin } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const nav = useNavigate();


  const onSubmit = async (data: LoginInput) => {
    if (loading) return;
    try {
      setLoading(true);
      await dispatch(signin(data)).unwrap();
      toast.success("Account created successfully", {
        position: "bottom-center",
        autoClose: 3000,
      });
      nav('/chat');
    } catch (err: any) {
      toast.error(err?.message || "register failed", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div>
        <h2>Create your account</h2>
        <AuthForm<LoginInput>
          title="Register"
          submitLabel="login"
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          loading={loading}
          showName={false}
        />

        <p>
          Don't have account? <Link to="/">register</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
