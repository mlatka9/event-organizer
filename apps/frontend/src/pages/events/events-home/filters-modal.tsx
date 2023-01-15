import { useState } from 'react';
import FilterButton from './filter-button';
import Button from '../../../components/common/button';
import ModalWrapper from '../../../components/common/modal-wrapper';
import { useSearchParams } from 'react-router-dom';

interface FiltersModalProps {
  defaultLocationStatus: string;
  defaultTimeRange: string;
  handleCloseModal: () => void;
}

const FiltersModal = ({
  defaultLocationStatus,
  // defaultVisibilityStatus,
  defaultTimeRange,
  handleCloseModal,
}: FiltersModalProps) => {
  // const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState({
    locationStatus: defaultLocationStatus,
    timeRange: defaultTimeRange,
  });

  const handleChangeValue = (key: string, newValue: string) => {
    setValues({ ...values, [key]: newValue });
  };

  const updateParam = (params: Record<string, string>) => {
    const currentParams = { ...searchParams };

    Object.keys(params).forEach((key) => {
      if (params[key] === 'all') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete currentParams[key];
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        currentParams[key] = params[key];
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSearchParams(currentParams);
  };

  const handleSubmit = () => {
    updateParam(values);
    handleCloseModal();
  };

  return (
    <>
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
