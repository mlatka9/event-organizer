import React from 'react';
import clsx from 'clsx';

interface GroupsFiltersProps {
  searchValue: string;
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedVisibility: 'PUBLIC' | 'PRIVATE' | undefined;
  onChangeVisibility: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GroupsFilters = ({ searchValue, onChangeSearch, onChangeVisibility, selectedVisibility }: GroupsFiltersProps) => {
  return (
    <div className={'flex justify-between mb-10'}>
      <div className="relative">
        <input
          value={searchValue || ''}
          onChange={onChangeSearch}
          type="text"
          id="group-search"
          className="w-[300px] bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 px-2 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-300  focus:outline-none"
        />
        <label
          htmlFor="group-search"
          className="absolute top-5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300"
        >
          Szukaj
        </label>
      </div>

      <div className={'w-[270px] grid grid-cols-3 relative '}>
        <div
          className={clsx(
            'h-full w-1/3 bg-blue-100 rounded-md absolute transition-transform',
            !selectedVisibility && 'translate-x-0',
            selectedVisibility === 'PUBLIC' && 'translate-x-full',
            selectedVisibility === 'PRIVATE' && 'translate-x-[200%]'
          )}
        />
        <div className={'z-10 h-full'}>
          <input
            type="radio"
            name="group-visibility"
            value="all"
            id="all"
            onChange={onChangeVisibility}
            checked={selectedVisibility === undefined}
            className={'hidden peer'}
          />
          <label
            htmlFor="all"
            className={clsx(
              'flex select-none justify-center h-full items-center cursor-pointer peer-checked:font-semibold',
              'text-neutral-600 peer-checked:text-blue-800'
            )}
          >
            wszytskie
          </label>
        </div>
        <div className={'z-10'}>
          <input
            type="radio"
            name="group-visibility"
            value="PUBLIC"
            id="PUBLIC"
            checked={selectedVisibility === 'PUBLIC'}
            onChange={onChangeVisibility}
            className={'hidden peer'}
          />
          <label
            htmlFor="PUBLIC"
            className={clsx(
              'flex select-none justify-center h-full items-center cursor-pointer peer-checked:font-semibold',
              'text-neutral-600 peer-checked:text-blue-800'
            )}
          >
            publiczne
          </label>
        </div>
        <div className={'z-10'}>
          <input
            onChange={onChangeVisibility}
            type="radio"
            name="group-visibility"
            value="PRIVATE"
            id="PRIVATE"
            checked={selectedVisibility === 'PRIVATE'}
            className={'hidden peer'}
          />
          <label
            htmlFor="PRIVATE"
            className={clsx(
              'flex select-none justify-center h-full items-center cursor-pointer peer-checked:font-semibold',
              'text-neutral-600 peer-checked:text-blue-800'
            )}
          >
            prywatne
          </label>
        </div>
      </div>
    </div>
  );
};

export default GroupsFilters;
