import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className={'grid min-h-screen'}>
      <main className="mx-auto h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
