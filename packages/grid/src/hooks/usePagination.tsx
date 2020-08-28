import React, { useState, useEffect } from "react";

export interface PaginationProps {
  /**
   * No of items in each page
   */
  pageSize: number;
  /**
   * Initial current page index. Start from 1
   */
  initialCurrentPage?: number;
  /**
   * Total number of rows
   */
  total: number;
  /**
   * Callback when page is changed
   */
  onChange?: (page: number) => void;
  /**
   * Pagination Component
   */
  component?:
    | React.FC<PaginationComponentProps>
    | React.ComponentClass<PaginationComponentProps>;
}

export type PaginationComponentProps = Omit<
  PaginationResults,
  "paginationComponent"
>;

export interface PaginationResults {
  /**
   * Current page number
   */
  currentPage: number;
  /**
   * Total pages
   */
  totalPages: number;
  /**
   * No of items in each page
   */
  pageSize: number;
  /**
   * Pagination component
   */
  paginationComponent: React.ReactNode;
  /**
   * Navigate to next page
   */
  nextPage: () => void;
  /**
   * Navigate to prev page
   */
  prevPage: () => void;
  /**
   * Navigate to first page
   */
  goToFirst: () => void;
  /**
   * Navigate to last page
   */
  goToLast: () => void;
  /**
   * Navigate to specific page
   */
  goToPage: (page: number) => void;
}

/**
 * Pagination hook
 * @param props
 */
const usePagination = (props: PaginationProps): PaginationResults => {
  const {
    initialCurrentPage = 1,
    pageSize = 10,
    total = 0,
    onChange,
    component = PaginationComponent,
  } = props;
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const totalPages = Math.ceil(total / pageSize);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goToPage = (page: number) => setCurrentPage(page);

  useEffect(() => {
    onChange && onChange(currentPage);
  }, [currentPage]);

  const pageProps = {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToFirst,
    goToLast,
    goToPage,
    pageSize,
  };

  const paginationComponent = React.createElement(component, pageProps);

  return {
    paginationComponent,
    ...pageProps,
  };
};

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  goToFirst,
  goToLast,
  goToPage,
  totalPages,
  nextPage,
  prevPage,
}) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    const isActive = currentPage === i;
    pages.push(
      <button onClick={() => goToPage(i)}>
        {isActive ? <strong>{i}</strong> : i}
      </button>
    );
  }
  return (
    <div>
      <button onClick={goToFirst} disabled={currentPage === 1}>
        First page
      </button>
      <button onClick={prevPage} disabled={currentPage === 1}>
        Prev page
      </button>
      {pages}
      <button onClick={nextPage} disabled={currentPage === totalPages}>
        Next page
      </button>
      <button onClick={goToLast} disabled={currentPage === totalPages}>
        Last page
      </button>
    </div>
  );
};

export default usePagination;
