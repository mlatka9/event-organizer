import { useState } from 'react';
import FilterButton from './filter-button';
import { useRouter } from 'next/router';
import Button from '../common/button';
import ModalWrapper from '../common/modal-wrapper';

interface FiltersModalProps {
  defaultLocationStatus: string;
  // defaultVisibilityStatus: string;
  defaultTimeRange: string;
  handleCloseModal: () => void;
}

const FiltersModal = ({
  defaultLocationStatus,
  // defaultVisibilityStatus,
  defaultTimeRange,
  handleCloseModal,
}: FiltersModalProps) => {
  const router = useRouter();

  const [values, setValues] = useState({
    locationStatus: defaultLocationStatus,
    // visibilityStatus: defaultVisibilityStatus,
    timeRange: defaultTimeRange,
  });

  console.log('values', values);

  const handleChangeValue = (key: string, newValue: string) => {
    setValues({ ...values, [key]: newValue });
  };

  const updateParam = (params: Record<string, string>) => {
    const currentParams = { ...router.query };

    Object.keys(params).forEach((key) => {
      if (params[key] === 'all') {
        delete currentParams[key];
      } else {
        currentParams[key] = params[key];
      }
    });

    router.replace({
      query: { ...currentParams },
    });
  };

  const handleSubmit = () => {
    updateParam(values);
    handleCloseModal();
  };

  return (
    <>
      {/*<div className={'fixed bg-gray-900/80 inset-0 z-[9999]'} onClick={handleCloseModal} />*/}
      <ModalWrapper handleCloseModal={handleCloseModal} title={'Filtry wydarzeń'}>
        <h3 className={'font-semibold text-lg mb-3'}>Lokalizacja</h3>
        <div className={'space-x-3 mb-8'}>
          <FilterButton
            label={'dowonly'}
            isSelected={values.locationStatus === 'all'}
            onClick={() => handleChangeValue('locationStatus', 'all')}
          />
          <FilterButton
            label={'stacjonarnie'}
            isSelected={values.locationStatus === 'STATIONARY'}
            onClick={() => handleChangeValue('locationStatus', 'STATIONARY')}
          />
          <FilterButton
            label={'online'}
            isSelected={values.locationStatus === 'ONLINE'}
            onClick={() => handleChangeValue('locationStatus', 'ONLINE')}
          />
        </div>
        {/*<h3 className={'font-semibold text-lg mb-3'}>Widoczność</h3>*/}
        {/*<div className={'space-x-3 mb-8'}>*/}
        {/*  <FilterButton*/}
        {/*    label={'wszystkie'}*/}
        {/*    isSelected={values.visibilityStatus === 'all'}*/}
        {/*    onClick={() => handleChangeValue('visibilityStatus', 'all')}*/}
        {/*  />*/}
        {/*  <FilterButton*/}
        {/*    label={'publiczne'}*/}
        {/*    isSelected={values.visibilityStatus === 'PUBLIC'}*/}
        {/*    onClick={() => handleChangeValue('visibilityStatus', 'PUBLIC')}*/}
        {/*  />*/}
        {/*  <FilterButton*/}
        {/*    label={'prywatne'}*/}
        {/*    isSelected={values.visibilityStatus === 'PRIVATE'}*/}
        {/*    onClick={() => handleChangeValue('visibilityStatus', 'PRIVATE')}*/}
        {/*  />*/}
        {/*</div>*/}
        <h3 className={'font-semibold text-lg mb-3'}>Termin</h3>
        <div className={'space-x-3 mb-8'}>
          <FilterButton
            label={'wszytstkie'}
            isSelected={values.timeRange === 'all'}
            onClick={() => handleChangeValue('timeRange', 'all')}
          />
          <FilterButton
            label={'dziś'}
            isSelected={values.timeRange === 'TODAY'}
            onClick={() => handleChangeValue('timeRange', 'TODAY')}
          />
          <FilterButton
            label={'w tym tygodniu'}
            isSelected={values.timeRange === 'THISWEEK'}
            onClick={() => handleChangeValue('timeRange', 'THISWEEK')}
          />
          <FilterButton
            label={'w tym miesiącu'}
            isSelected={values.timeRange === 'THISMONTH'}
            onClick={() => handleChangeValue('timeRange', 'THISMONTH')}
          />
        </div>
        <Button onClick={handleSubmit} className={'ml-auto'}>
          zapisz filtry
        </Button>
      </ModalWrapper>
    </>
  );
};

export default FiltersModal;
