import { ReactNode } from 'react';
import Header from '../common/header';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Header />
      <main className="mx-auto mt-10 max-w-[1000px] pt-[80px]">{children}</main>
    </div>
  );
};

export default MainLayout;
