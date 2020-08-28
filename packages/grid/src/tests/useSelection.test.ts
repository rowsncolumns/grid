import { renderHook, act } from "@testing-library/react-hooks";
import useSelection from "./../hooks/useSelection";

describe("useSelection", () => {
  it("is a function", () => {
    expect(typeof useSelection).toBe("function");
  });

  it("sets initialselection to be empty", () => {
    const { result } = renderHook(() => useSelection({}));
    expect(result.current.selections).toStrictEqual([]);
  });

  it("picks up initialselection", () => {
    const initialSelections = [
      { bounds: { top: 0, left: 0, right: 0, bottom: 0 } },
    ];
    const { result } = renderHook(() =>
      useSelection({
        initialSelections,
      })
    );
    expect(result.current.selections).toStrictEqual(initialSelections);
  });
});
