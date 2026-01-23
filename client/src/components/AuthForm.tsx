import type {

 FieldErrors,
   FieldValues,
  UseFormRegister,
  Path
} from "react-hook-form";


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
            type="text"
            {...register("name" as Path<T>)}
            placeholder="Enter your name"
          />
          {errors.name && <p>{errors.name.message as string}</p>}
        </div>
      )}

      <div>
        <label> Email</label>
        <input type="email"
          {...register("email" as Path<T>)}
          placeholder="email@example.com"
        />
        {errors.email && <p>{errors.email?.message as string}</p>}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password" as Path<T>)} placeholder="*******" />
        {errors.password && <p>{errors.password?.message as string}</p>}
      </div>
      <button type="submit" disabled={loading} className=" cursor-pointer">
        {loading ? "loading..." : submitLabel}
      </button>
    </form>
  );
};

export default AuthForm;
