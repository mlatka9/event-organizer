import React from "react";
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import FormErrorMessage from "@components/form/form-error-message";

export type FormInputProps<V extends FieldValues> = {
  label: string;
  name: Path<V>;
  rules?: RegisterOptions;
  register: UseFormRegister<V>;
  error?: FieldError;
} & React.ComponentProps<"textarea">;

const FormTextarea = <TFormValues extends FieldValues>({
  register,
  rules,
  label,
  name,
  error,
  ...props
}: FormInputProps<TFormValues>) => (
  <div>
    <div className="relative">
      <textarea
        id={label}
        className="block max-h-[150px] min-h-[110px] w-full appearance-none rounded-lg border-2 border-gray-300 bg-white px-2  pt-4 pb-2.5 text-sm text-gray-900 focus:border-2  focus:border-blue-300 focus:outline-none"
        placeholder=" "
        {...(register && register(name, rules))}
        {...props}
      />

      <label
        htmlFor={label}
        className="absolute top-5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300"
      >
        {label}
      </label>
    </div>
    {error && <FormErrorMessage message={error.message} />}
  </div>
);

export default FormTextarea;
