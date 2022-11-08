import clsx from "clsx";
import React from "react";
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import FormErrorMessage from "@components/form/form-error-message";

type FormSelectOptionType = { value: string; label: string; disabled: boolean };

export type FormSelectProps<V extends FieldValues> = {
  label: string;
  name: Path<V>;
  rules?: RegisterOptions;
  register: UseFormRegister<V>;
  error?: FieldError;
  options: FormSelectOptionType[];
} & React.ComponentProps<"select">;

const FormSelect = <TFormValues extends FieldValues>({
  register,
  rules,
  label,
  name,
  error,
  options,
  ...props
}: FormSelectProps<TFormValues>) => {
  return (
    <div>
      <div className="relative">
        <select
          id={label}
          className="bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 px-2 pb-2.5 pt-4 text-sm focus:border-blue-300 focus:outline-none"
          placeholder="category"
          {...(register && register(name, rules))}
          {...props}
          defaultValue=""
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={label}
          className={clsx(
            "pointer-events-none absolute top-5 left-1 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300"
          )}
        >
          {label}
        </label>
      </div>
      {error && <FormErrorMessage message={error.message} />}
    </div>
  );
};

export default FormSelect;
