import React, { useCallback, useEffect, useRef } from "react";
import { CellInterface, GridRef, SelectionArea } from "../Grid";
import { selectionFromActiveCell, prepareClipboardData } from "./../helpers";
import { MimeType } from "../types";

export interface CopyProps {
  /**
   * Selection bounds
   */
  selections: SelectionArea[];
  /**
   * Active cell
   */
  activeCell?: CellInterface | null;
  /**
   * Value getter of a cell
   */
  getValue: (cell: CellInterface) => any;
  /**
   * Get text value
   */
  getText: (config: any) => string | undefined;
  /**
   * Grid reference to access grid methods
   */
  gridRef: React.MutableRefObject<GridRef | null>;
  /**
   * Callback when a paste is executed
   */
  onPaste?: (
    rows: (string | null)[][],
    activeCell: CellInterface | null,
    selectionArea: SelectionArea[],
    /* Selection to remove */
    selection?: SelectionArea
  ) => void;
  /**
   * When user tries to cut a selection
   */
  onCut?: (selection: SelectionArea) => void;
  /**
   * Callback on copy event
   */
  onCopy?: (selection: SelectionArea[]) => void;
}

export interface CopyResults {
  copy: () => void;
  paste: () => void;
  cut: () => void;
}

type SupportedType =
  | "application/xhtml+xml"
  | "application/xml"
  | "image/svg+xml"
  | "text/html"
  | "text/xml";

const defaultGetText = (text: any) => text;

/**
 * Copy paste hook
 * Usage
 *
 * useCopyPaste ({
 *  onPaste: (text) => {
 *  }
 * })
 */
const useCopyPaste = ({
  selections = [],
  activeCell = null,
  getValue,
  gridRef,
  onPaste,
  onCut,
  onCopy,
  getText = defaultGetText,
}: CopyProps): CopyResults => {
  const selectionRef = useRef({ selections, activeCell, getValue });
  const cutSelections = useRef<SelectionArea>();

  /* Keep selections and activeCell upto date */
  useEffect(() => {
    selectionRef.current = { selections, activeCell, getValue };
  }, [selections, activeCell, getValue]);

  const currentSelections = () => {
    const sel = selectionRef.current.selections.length
      ? selectionRef.current.selections
      : selectionFromActiveCell(selectionRef.current.activeCell);
    return sel[sel.length - 1];
  };

  useEffect(() => {
    if (!gridRef.current) return;
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
    };
  }, []);

  const handleCut = useCallback(() => {
    if (document.activeElement !== gridRef.current?.container) {
      return;
    }
    cutSelections.current = currentSelections();
    handleProgramaticCopy();
  }, []);

  const handleCopy = useCallback(
    (e: ClipboardEvent) => {
      if (document.activeElement !== gridRef.current?.container) {
        return;
      }
      /* Only copy the last selection */
      const selection = currentSelections();
      const { bounds } = selection;
      const { top, left, right, bottom } = bounds;
      const rows = [];
      const cells = [];
      for (let i = top; i <= bottom; i++) {
        const row = [];
        const cell = [];
        for (let j = left; j <= right; j++) {
          const coords = {
            rowIndex: i,
            columnIndex: j,
          };
          const config = {
            ...selectionRef.current.getValue(coords),
            sourceCell: coords,
          };
          const value = getText(config);
          cell.push(config);
          row.push(value);
        }
        rows.push(row);
        cells.push(cell);
      }
      const [html, csv] = prepareClipboardData(rows);
      e.clipboardData?.setData(MimeType.html, html);
      e.clipboardData?.setData(MimeType.plain, csv);
      e.clipboardData?.setData(MimeType.csv, csv);
      e.clipboardData?.setData(MimeType.json, JSON.stringify(cells));
      e.preventDefault();

      onCopy?.([selection]);
    },
    [currentSelections]
  );

  const handlePaste = (e: ClipboardEvent) => {
    if (document.activeElement !== gridRef.current?.container) {
      return;
    }
    const items = e.clipboardData?.items;
    if (!items) return;
    const mimeTypes = [
      MimeType.json,
      MimeType.html,
      MimeType.csv,
      MimeType.plain,
    ];
    let type;
    let value;
    let plainTextValue = e.clipboardData?.getData(MimeType.plain);
    for (type of mimeTypes) {
      value = e.clipboardData?.getData(type);
      if (value) break;
    }
    if (!type || !value) {
      console.warn("No clipboard data to paste");
      return;
    }
    let rows: any[] = [];
    if (/^text\/html/.test(type)) {
      const domparser = new DOMParser();
      const doc = domparser.parseFromString(value, type as SupportedType);
      const supportedNodes = "table, p, h1, h2, h3, h4, h5, h6";
      let nodes = doc.querySelectorAll(supportedNodes);
      if (nodes.length === 0) {
        rows.push([plainTextValue]);
      }
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.nodeName === "TABLE") {
          const tableRows = node.querySelectorAll("tr");
          for (let i = 0; i < tableRows.length; i++) {
            const tableRow = tableRows[i];
            const row = [];
            const cells = tableRow.querySelectorAll("td");
            for (let j = 0; j < cells.length; j++) {
              const cell = cells[j];
              row.push(cell.textContent);
            }
            rows.push(row);
          }
        } else {
          // Single nodes
          rows.push([node.textContent]);
        }
      }
    } else if (type === MimeType.json) {
      rows = JSON.parse(value);
    } else if (type === MimeType.plain) {
      rows = [[value]];
    } else {
      const values = value.split("\n");
      for (const val of values) {
        const row = [];
        for (const cell of val.split(",")) {
          row.push(cell.replace(/^\"|\"$/gi, ""));
        }
        rows.push(row);
      }
    }

    onPaste &&
      onPaste(
        rows,
        selectionRef.current.activeCell,
        selectionRef.current.selections,
        cutSelections.current
      );

    cutSelections.current = undefined;
  };

  /**
   * User is trying to copy from outisde the app
   */
  const handleProgramaticCopy = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.focus();
    document.execCommand("copy");
  }, []);

  /**
   * User is trying to paste from outisde the app
   */
  const handleProgramaticPaste = useCallback(async () => {
    if (!gridRef.current) return;
    gridRef.current.focus();
    const text = await navigator.clipboard.readText();
    const clipboardData = new DataTransfer();
    clipboardData.setData(MimeType.plain, text);
    const event = new ClipboardEvent("paste", { clipboardData });
    handlePaste(event);
  }, []);

  return {
    copy: handleProgramaticCopy,
    paste: handleProgramaticPaste,
    cut: handleCut,
  };
};

export default useCopyPaste;
