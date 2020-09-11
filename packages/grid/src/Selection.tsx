import React, { memo } from "react";
import { SelectionProps } from "./Grid";
import { createHTMLBox } from "./utils";

const Selection: React.FC<SelectionProps> = memo((props) => {
  return createHTMLBox({ strokeWidth: 1, ...props });
});

export default Selection;
