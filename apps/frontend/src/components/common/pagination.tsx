import ChevronDownIcon from '../icons/chevron-down-icon';
import clsx from 'clsx';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  changePage: (pageNumber: number) => void;
}

const Pagination = ({ pageCount, currentPage, changePage }: PaginationProps) => {
  console.log(pageCount);
  return (
    <div className={'flex items-center justify-center py-5'}>
      <button onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1}>
        <ChevronDownIcon
          className={clsx(
            'rotate-90 cursor-pointer fill-neutral-600 hover:fill-neutral-800',
            currentPage <= 1 && 'fill-neutral-300 hover:fill-neutral-300'
          )}
        />
      </button>
      <div className={'text-lg font-semibold mx-10 text-gray-600'}>{currentPage}</div>
      <button onClick={() => changePage(currentPage + 1)} disabled={currentPage >= pageCount}>
        <ChevronDownIcon
          className={clsx(
            '-rotate-90 cursor-pointer fill-neutral-600 hover:fill-neutral-800',
            currentPage >= pageCount && 'fill-neutral-300 hover:fill-neutral-300'
          )}
        />
      </button>
    </div>
  );
};

export default Pagination;
