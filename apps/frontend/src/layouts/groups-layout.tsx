import Header from '../components/common/header';
import { Outlet } from 'react-router-dom';

const GroupsLayout = () => {
  return (
    <div className={'grid lg:grid-cols-[200px_1fr] xl:grid-cols-[260px_1fr] min-h-screen w-full'}>
      <Header />
      <main className="mx-auto max-w-[1200px] w-full h-full flex flex-col items-center px-5">
        <Outlet />
      </main>
    </div>
  );
};

export default GroupsLayout;
