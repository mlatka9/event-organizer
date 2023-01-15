import { useDeleteEventPrepareListItemMutation } from '../../../hooks/mutation/events';
import { useEventDetails } from '../../../layouts/events-layout';
import { useOnClickOutside } from 'usehooks-ts';
import { useRef } from 'react';

interface EventPrepareListItemSettingsProps {
  itemId: string;
  closeSettingsModal: () => void;
}

const EventPrepareListItemSettings = ({ itemId, closeSettingsModal }: EventPrepareListItemSettingsProps) => {
  const ref = useRef(null);
  const { event } = useEventDetails();
  const { mutate: deleteEventPrepareListItem } = useDeleteEventPrepareListItemMutation();

  const handleClickOutside = () => {
    closeSettingsModal();
    console.log('clicked outside');
  };

  useOnClickOutside(ref, handleClickOutside);

  const handleDeleteEventPrepareListItem = () => {
    deleteEventPrepareListItem({
      eventId: event.id,
      itemId,
    });
  };

  return (
    <div className={'absolute top-5 right-0 bg-white rounded-md shadow'} ref={ref}>
      <button
        className={'w-32 text-left text-red-400  hover:bg-red-50 transition-colors py-2 px-3'}
        onClick={handleDeleteEventPrepareListItem}
      >
        usuń
      </button>
    </div>
  );
};

export default EventPrepareListItemSettings;
