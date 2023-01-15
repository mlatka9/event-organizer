import CloseIcon from '../../../components/icons/close-icon';

interface FilterTileProps {
  label: string;
  handleRemove: () => void;
}

const FilterTile = ({ handleRemove, label }: FilterTileProps) => {
  return (
    <div className={'text-sm bg-blue-500 text-white flex items-center justify-center px-3 py-2 rounded-full'}>
      <span>{label}</span>
      <button onClick={handleRemove} className={'cursor-pointer ml-2'}>
        <CloseIcon width={14} height={14} className={'fill-white'} />
      </button>
    </div>
  );
};

export default FilterTile;
