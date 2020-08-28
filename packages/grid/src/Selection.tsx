import React from "react";
import { SelectionProps } from "./Grid";
import { createHTMLBox } from "./utils";

const Selection: React.FC<SelectionProps> = (props) => {
  return createHTMLBox({ strokeWidth: 1, strokeBoxWidth: 0, ...props });
};

export default Selection;
