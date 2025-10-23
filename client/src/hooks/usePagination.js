import { useMemo } from 'react';

// A helper function to create an array of numbers
const range = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = ({ data, itemsPerPage, currentPage, setCurrentPage, siblingCount = 1 }) => {
  const maxPage = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.ceil(data.length / itemsPerPage);
  }, [data, itemsPerPage]);

  const currentData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }, [data, currentPage, itemsPerPage]);

  const jump = (page) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  };

  const next = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, maxPage));
  };

  const prev = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(data.length / itemsPerPage);
    const totalPageNumbersToDisplay = siblingCount * 2 + 3;

    if (totalPageNumbersToDisplay >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = range(1, 3 + 2 * siblingCount);
      return [...leftRange, '...', lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = range(lastPageIndex - (3 + 2 * siblingCount) + 1, lastPageIndex);
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  }, [siblingCount, currentPage, maxPage, data, itemsPerPage]);

  return { jump, next, prev, currentData, maxPage, paginationRange };
};

export default usePagination;
