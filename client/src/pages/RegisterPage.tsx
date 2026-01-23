import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import {
  RegisterSchema,
  type RegisterInput,
} from "../validation/authValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { signup } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema) });
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const nav = useNavigate();


  const onSubmit = async (data: RegisterInput) => {
    if (loading) return;
    try {
      setLoading(true);
      await dispatch(signup(data)).unwrap();
      toast.success("Account created successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      nav('/login');
    } catch (err: any) {
      toast.success(err?.message || "register failed", {
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
        <AuthForm<RegisterInput>
          title="Register"
          submitLabel="register"
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          loading={loading}
          showName={true}
        />

        <p>
          Already have an account? <Link to="/login">login</Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
