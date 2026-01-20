import {
  useForm,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../validation/authValidation";
import type { Path } from "react-router-dom";

interface BaseFormFields extends FieldValues {
  name?: string;
  email: string;
  password: string;
}

interface AuthFormProps<T extends BaseFormFields> {
  title: string;
  submitLabel: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void | void>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  loading?: boolean;
  showName?: boolean;
}

const AuthForm = <T extends BaseFormFields>({
  submitLabel,
  onSubmit,
  register,
  errors,
  loading,
  showName = false,
}: AuthFormProps<T>) => {
  return (
    <form onSubmit={onSubmit}>
      {showName && (
        <div>
          <label>Name</label>
          <input
            {...register("name" as Path<T>)}
            placeholder="Enter your name"
          />
          {errors.name && <p>{errors.name.message as string}</p>}
        </div>
      )}

      <div>
        <label> Email</label>
        <input
          {...register("email" as Path<T>)}
          placeholder="email@example.com"
        />
        {errors.email && <p>{errors.email?.message as string}</p>}
      </div>
      <div>
        <label>Password</label>
        <input {...register("password" as Path<T>)} placeholder="*******" />
        {errors.password && <p>{errors.password?.message as string}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "loading..." : submitLabel}
      </button>
    </form>
  );
};

export default AuthForm;
