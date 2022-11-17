import { AppProps } from 'next/app';
import './styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} draggable={false} pauseOnHover={false} />
    </QueryClientProvider>
  );
}

export default CustomApp;
