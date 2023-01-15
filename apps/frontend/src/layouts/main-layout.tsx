import Header from '../components/common/header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className={'grid lg:grid-cols-[200px_1fr] xl:grid-cols-[260px_1fr] min-h-screen'}>
      <Header />
      <main className="mx-auto max-w-[1200px] w-full h-full flex flex-col px-2 lg:px-5">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
