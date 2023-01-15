import ModalWrapper from '../../../components/common/modal-wrapper';
import { useState } from 'react';
import { useGroupsToShareEventQuery } from '../../../hooks/query/events';
import PlusIcon from '../../../components/icons/plus-icons';
import Button from '../../../components/common/button';
import ShareEventItem from '../../groups/groups-details/share-event-item';

interface ShareEventModalProps {
  handleCloseModal: () => void;
  eventId: string;
}

const ShareEventModal = ({ handleCloseModal, eventId }: ShareEventModalProps) => {
  const [value, setValue] = useState('');

  const { data, isSuccess } = useGroupsToShareEventQuery({
    eventId,
    phrase: value || undefined,
  });

  return (
    <ModalWrapper title={'Udostępnij wydarzenie'} handleCloseModal={handleCloseModal}>
      <div className={'min-h-[500px] w-full'}>
        <input
          className={'ring rounded-md mb-10 w-full'}
          value={value}
          onChange={({ target }) => {
            setValue(target.value);
          }}
        />
        <div>
          <ul>
            {isSuccess && data.length > 0
              ? data.map((group) => <ShareEventItem eventId={eventId} group={group} key={group.id} />)
              : 'Nie jesteś członkiem żadnych grup na których możesz udostępnić do wydarzenie'}
          </ul>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ShareEventModal;
