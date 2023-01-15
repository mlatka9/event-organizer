import clsx from 'clsx';
import { MouseEventHandler } from 'react';

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const FilterButton = ({ isSelected, label, onClick }: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-full p-3 ring-1 px-3 py-2 ring-gray-200 transition-all text-sm ',
        isSelected && 'ring-red-500 bg-blue-200/50 text-blue-700 font-semibold',
        !isSelected && 'hover:ring-gray-300 hover:text-neutral-900 hover:bg-gray-50 text-neutral-700'
      )}
    >
      {label}
    </button>
  );
};

export default FilterButton;
