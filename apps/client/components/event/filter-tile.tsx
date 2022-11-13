interface FilterTileProps {
  label: string;
  handleRemove: () => void;
}

const FilterTile = ({ handleRemove, label }: FilterTileProps) => {
  return (
    <div className={'text-sm bg-blue-50 text-blue-800 flex items-center justify-center px-3 py-2 rounded-full'}>
      <span>{label}</span>
      <button onClick={handleRemove} className={'cursor-pointer ml-2'}>
        X
      </button>
    </div>
  );
};

export default FilterTile;
