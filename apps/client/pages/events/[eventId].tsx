import { useRouter } from 'next/router';
import { useEventInfoQuery } from '../../hooks/query/events';
import MainLayout from '../../components/layouts/main-layout';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('../../components/map'), {
  ssr: false,
});

const EventDetailsPage = () => {
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const { data, isSuccess, isError, error } = useEventInfoQuery(eventId, router.isReady);

  console.log(data);

  if (isError && error?.response?.status === 401) {
    return <MainLayout>ERRor</MainLayout>;
  }

  if (!isSuccess) return <>loading...</>;

  return (
    <MainLayout>
      <img src={data.bannerImage} className={'w-full h-[300px] object-cover'} />
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <p>{data.displayAddress}</p>
      {data.latitude && data.longitude && (
        <MapWithNoSSR
          mapHeight={'300px'}
          markers={[{ id: data.id, longitude: data.longitude, latitude: data.latitude }]}
        />
      )}
    </MainLayout>
  );
};

export default EventDetailsPage;
