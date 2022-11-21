import Header from '../components/common/header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Header hasLoginButtons={false} />
      <main className="mx-auto pt-[80px] h-full">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
