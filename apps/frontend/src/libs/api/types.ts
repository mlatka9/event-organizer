import { AxiosError } from 'axios';

export class APIError extends AxiosError<{ message?: string }> {}
