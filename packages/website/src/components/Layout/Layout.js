import React from "react";
import Layout from "@theme/Layout";
import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  theme
} from "@chakra-ui/core";
import { GlobalCSS, css } from "@emotion/core";
import Head from "@docusaurus/Head";

export default function NewLayout(props) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <script
          data-jsd-embedded
          data-key="9f3839c2-a457-48a1-b465-d938d364ef1b"
          data-base-url="https://jsd-widget.atlassian.com"
          src="https://jsd-widget.atlassian.com/assets/embed.js"
        ></script>
      </Head>
      <CSSReset />
      {/* <GlobalCSS
        style={css`
          .rowsncolumns-grid {
            border-right-width: 1px;
            border-right-style: solid;
            border-right-color: ${colorMode === 'light' ? CELL_BORDER_COLOR : theme?.colors.gray[600]}
          }
        `}
      /> */}
      <Layout {...props} />
    </ThemeProvider>
  );
}
