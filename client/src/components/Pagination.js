import React from 'react';

/**
 * Pagination component with Bootstrap 5 styling
 * @param {object} pagination - Pagination object from usePagination hook
 */
const Pagination = ({ pagination }) => {
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    getPageNumbers,
  } = pagination;

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="User table pagination" className="w-75 p-3" style={{ width: '70%' }}>
      <ul className="pagination pagination-lg mb-0">
        <li className={`page-item ${!hasPreviousPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={goToFirstPage}
            disabled={!hasPreviousPage}
            aria-label="Go to first page"
          >
            &laquo;
          </button>
        </li>

        {/* Previous Page Button */}
        <li className={`page-item ${!hasPreviousPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={goToPreviousPage}
            disabled={!hasPreviousPage}
            aria-label="Go to previous page"
          >
            &lsaquo;
          </button>
        </li>

        {pageNumbers.map((page, index) => (
          <li
            key={index}
            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''
              }`}
          >
            {page === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <button
                className="page-link"
                onClick={() => goToPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={goToNextPage}
            disabled={!hasNextPage}
            aria-label="Go to next page"
          >
            &rsaquo;
          </button>
        </li>

        <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={goToLastPage}
            disabled={!hasNextPage}
            aria-label="Go to last page"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
