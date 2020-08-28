// @ts-nocheck
import { renderHook, act } from "@testing-library/react-hooks";
import usePagination from "../hooks/usePagination";

describe("usePagination", () => {
  let options = { pageSize: 10, total: 100 };
  it("is a function", () => {
    expect(typeof usePagination).toBe("function");
  });

  it("throw error if pageSize and total is not provided", () => {
    const { result } = renderHook(() => usePagination());
    expect(result.error.message).toBe(
      "Cannot read property 'initialCurrentPage' of undefined"
    );
  });

  it("sets initialCurrentpage to 1", () => {
    const { result } = renderHook(() => usePagination(options));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(10);
  });

  it("updates currentPage", () => {
    const { result } = renderHook(() => usePagination(options));
    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(2);
    act(() => result.current.goToPage(3));
    expect(result.current.currentPage).toBe(3);
    act(() => result.current.goToLast());
    expect(result.current.currentPage).toBe(10);
    act(() => result.current.goToFirst());
    expect(result.current.currentPage).toBe(1);
  });
});
