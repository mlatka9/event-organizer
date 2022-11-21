import React from 'react';
import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';
import FormErrorMessage from './form-error-message';

export interface FormInputProps<V extends FieldValues> extends React.ComponentProps<'input'> {
  label: string;
  name: Path<V>;
  rules?: RegisterOptions;

  register: UseFormRegister<V>;
  error?: FieldError;
}

const FormInput = <V extends FieldValues>({ rules, label, name, register, error, ...props }: FormInputProps<V>) => {
  return (
    <div>
      <div className="relative">
        <input
          type="text"
          id={label}
          className="bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 px-2 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-300  focus:outline-none"
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
};

export default FormInput;
