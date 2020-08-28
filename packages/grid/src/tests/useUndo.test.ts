import { renderHook, act } from "@testing-library/react-hooks";
import useUndo, { PatchInterface } from "./../hooks/useUndo";

type Patch = any;

describe("useUndo", () => {
  it("is a function", () => {
    expect(typeof useUndo).toBe("function");
  });

  it("initializes with falsy canUndo and canRedo", () => {
    const { result } = renderHook(() => useUndo());
    expect(result.current.canRedo).toBeFalsy;
    expect(result.current.canUndo).toBeFalsy;
  });

  it("can add add to stack", () => {
    const { result } = renderHook(() => useUndo({}));
    const patch: PatchInterface<Patch> = {
      patches: [{ op: "replace", value: "b", path: ["hello"] }],
      inversePatches: [{ op: "replace", value: "a", path: ["hello"] }],
    };

    act(() => {
      result.current.add(patch);
    });
    expect(result.current.canUndo).toBeTruthy();
  });

  it("can add undo and redo", () => {
    const { result } = renderHook(() => useUndo({}));
    const patch: PatchInterface<Patch> = {
      patches: [{ op: "replace", value: "b", path: ["hello"] }],
      inversePatches: [{ op: "replace", value: "a", path: ["hello"] }],
    };

    act(() => {
      result.current.add(patch);
    });
    expect(result.current.canUndo).toBeTruthy();
    act(() => {
      result.current.undo();
    });
    expect(result.current.canUndo).toBeFalsy();
    expect(result.current.canRedo).toBeTruthy();
  });

  it("calls onundo and onredo", () => {
    const onUndo = jest.fn();
    const onRedo = jest.fn();
    const { result } = renderHook(() => useUndo({ onUndo, onRedo }));
    const patch: PatchInterface<Patch> = {
      patches: [{ op: "replace", value: "b", path: ["hello"] }],
      inversePatches: [{ op: "replace", value: "a", path: ["hello"] }],
    };

    act(() => {
      result.current.add(patch);
    });
    expect(result.current.canUndo).toBeTruthy();
    act(() => {
      result.current.undo();
    });
    expect(onUndo).toBeCalled();
    expect(onUndo).toBeCalledTimes(1);

    act(() => {
      result.current.redo();
    });
    expect(onRedo).toBeCalled();
    expect(onRedo).toBeCalledTimes(1);
  });
});
