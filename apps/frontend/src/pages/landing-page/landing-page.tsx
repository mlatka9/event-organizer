import LandingPhoto1 from '../../assets/images/landing-photo-1.jpg';
import LandingPhoto2 from '../../assets/images/landing-photo-2.jpg';
import LandingPhoto3 from '../../assets/images/landing-photo-3.jpg';
import LandingPhoto4 from '../../assets/images/landing-photo-4.jpg';

import Button from '../../components/common/button';
import { Link, useNavigate } from 'react-router-dom';
import FeatureCard from './feature-card';
import LandingPageHeader from './landing-page-header';
import { useAuth } from '../../hooks/use-auth';

const FEATURES = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet,  adipi scing elit',
    text: 'um dolor sit amet, iste natus error tam re cons minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod',
  },
  {
    id: 2,
    title: 'ation ullamco laboris nisi ut aliquip commodo consequa',
    text: ' dolor sit amet, consectetur euis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur',
  },
  {
    id: 3,
    title: 'Fugiat nulla pariatur. Excepteur cupidatat non proident',
    text: 'perspiciatis unde omnis iste Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni ',
  },
];

const HomePage = () => {
  console.log('LandingPhoto1', LandingPhoto1);
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log(user);

  return (
    <div className={'overflow-hidden px-2'}>
      <div className={'flex justify-between lg:p-5'}>
        <Link to={'/events'} data-cy="logo">
          <div className={'font-semibold text-blue-900 text-2xl'}>Organizator wydarzeń</div>
        </Link>
        {!user && (
          <div className={'flex gap-3'}>
            <Button className={'px-[8px]'} onClick={() => navigate('/login')}>
              Zaloguj się
            </Button>
            <Button kind={'secondary'} className={'px-[8px]'} onClick={() => navigate('/register')}>
              Zarejestruj się
            </Button>
          </div>
        )}
      </div>
      <div className={'max-w-[1000px] mx-auto flex flex-col'}>
        <h1 className={'text-2xl lg:text-6xl font-semibold mt-8 lg:mt-20 mb-5'}>
          Lorem ipsum dolor sit amet, <span className={'text-blue-800 '}>consectetur adipiscing</span> elit, sed do
          eiusmod eiusmoda.
        </h1>
        <p className={'text-neutral-600 leading-8 lg:text-lg mb-20 lg:mb-32 max-w-[700px]'}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
        <div className={'max-h-[450px] flex gap-10'}>
          <img src={LandingPhoto1} className={'object-cover max-w-[800px]'} />
          <img src={LandingPhoto2} className={'object-cover'} />
        </div>

        <div className={'lg:flex mt-16 lg:mt-40 mx-auto lg:ml-0 lg:gap-10 lg:flex-row-reverse'}>
          <div className={'max-w-[450px]'}>
            <LandingPageHeader>Lorem ipsum dolor sit amet, consectetur adipiscing elit</LandingPageHeader>
            <p className={'text-neutral-600 text-lg'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
          <img src={LandingPhoto3} className={'max-w-[400px] w-full'} alt={''} />
        </div>

        <div className={'lg:flex mt-16 mt-16 lg:mt-40 mx-auto lg:mr-0 lg:gap-10'}>
          <div className={'max-w-[400px]'}>
            <LandingPageHeader>Lorem ipsum dolor sit amet, consectetur adipiscing elit</LandingPageHeader>
            <p className={'text-neutral-600 text-lg'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
          <img src={LandingPhoto4} className={'max-w-[400px] w-full'} alt={''} />
        </div>
        <div className={'grid lg:grid-cols-3 gap-10 mt-16 lg:mt-40 mb-32 mx-auto'}>
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} title={feature.title} text={feature.text} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
