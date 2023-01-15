interface FormErrorMessageProps {
  message?: string
}
const FormErrorMessage = ({ message }: FormErrorMessageProps) => <p className="mt-1 text-xs text-red-500">{message}</p>

export default FormErrorMessage
