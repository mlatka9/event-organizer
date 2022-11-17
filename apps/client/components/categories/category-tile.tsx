import PlusIcon from '../icons/plus-icons';
import CloseIcon from '../icons/close-icon';
import clsx from 'clsx';

interface CategoryTile {
  iconType: 'REMOVE' | 'ADD';
  onButtonClick: () => void;
  name: string;
}
const CategoryTile = ({ onButtonClick, iconType, name }: CategoryTile) => {
  return (
    <div
      className={clsx(
        'bg-blue-100 text-blue-800 rounded-full px-2 py-1 flex items-center mr-2',
        iconType === 'ADD' && '!bg-purple-100 !text-purple-800'
      )}
    >
      <span className={'mr-2'}>{name}</span>
      <button onClick={onButtonClick}>
        {iconType === 'ADD' ? (
          <PlusIcon width={15} height={15} className={'fill-purple-900 hover:fill-purple-600'} />
        ) : (
          <CloseIcon width={15} height={15} className={'fill-blue-900 hover:fill-blue-600'} />
        )}
      </button>
    </div>
  );
};

export default CategoryTile;
