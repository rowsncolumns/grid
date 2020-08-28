import React from "react";
import clsx from "clsx";
import Layout from "./../components/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import SpreadSheet from "@rowsncolumns/spreadsheet";
import {
  SimpleGrid,
  Box,
  Text,
  Button,
  List,
  ListItem,
  Image,
} from "@chakra-ui/core";

function Feature({ imageUrl, title, description, url, align = "center" }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <Box textAlign={align}>
      <Image src={imageUrl} maxHeight="150px" ml="auto" mr="auto" mb={6} />
      <Text fontSize={18} fontWeight="bold">
        {title}
      </Text>
      <Text>{description}</Text>
      {url && (
        <Button
          variant="link"
          as="a"
          mt={1}
          href={url}
          variantColor="teal"
          _hover={{ color: "teal" }}
        >
          Learn more
        </Button>
      )}
    </Box>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={"Home"}
      description="React Components for Tabular Data. SpreadSheet and DataGrid for the Enterprise."
    >
      <SimpleGrid
        columns={[1, 1, 2]}
        className="container"
        height={["auto", "auto", 600]}
        spacing={30}
        pt={5}
        pb={10}
      >
        <Box justifyContent="center" display="flex" flexDirection="column">
          <Box background='red' borderRadius={5} color='white' p={2} fontSize={14} mb={2}>
            UPDATE: Now with Formula Support
          </Box>
          <Text as="h1" fontSize="4xl" fontWeight="bold" mb={2}>
            SpreadSheet Grid
          </Text>
          <Text mb={6} fontSize="lg">
            Excel-like DataGrid component for React JS. Built for high
            performance rendering similar to google sheets.
          </Text>
          <List styleType="disc" pb={5}>
            <ListItem>High performance (uses canvas for rendering)</ListItem>
            <ListItem>Declarative</ListItem>
            <ListItem>Easily customizable</ListItem>
            <ListItem>
              Supports row, column freezing, autofilter views, cell styling and
              formatting etc
            </ListItem>
            <ListItem>Formulas with Cross-sheet references</ListItem>
            <ListItem fontWeight="bold" textDecoration="underline">
              <a href="#features">View features</a>
            </ListItem>
          </List>
          <Box>
            {/* <Button variantColor='blue' mr={2}>Demo</Button> */}
            <Button
              as="a"
              href="/docs/install"
              variantColor="purple"
              _hover={{ color: "white" }}
            >
              Get Started
            </Button>
            <Button
              ml={2}
              as="a"
              href="/demo"
              variantColor="teal"
              _hover={{ color: "white" }}
            >
              Demo
            </Button>
          </Box>
        </Box>
        <Box minWidth={[0, 0, 500, 700]} display="flex" pt={5}>
          <SpreadSheet initialColorMode="light" />
        </Box>
      </SimpleGrid>

      {/* Features */}
      <Box bg="#eee" pt="20px" pb="20px">
        <SimpleGrid
          className="container"
          columns={[1, 1, 3]}
          spacing={10}
          pt="20px"
          pb="20px"
        >
          <Feature
            title="Developer friendly"
            description="SpreadSheet Grid is very easy to implement and it is highly customizable"
            imageUrl="/img/undraw_web_developer_p3e5.svg"
          />
          <Feature
            title="Built using React"
            description="Declaratively render cells, editors, tooltips, context menu very quickly"
            imageUrl="/img/undraw_react_y7wq.svg"
          />
          <Feature
            title="High Performance"
            description="Data is rendered in Canvas, which means no DOM nodes. So you are able to display millions of rows and columns without any peformance impact."
            imageUrl="/img/undraw_fast_loading_0lbh.svg"
          />
        </SimpleGrid>
      </Box>
      {/* / Features */}
      <Box bg="#f8f8f8" pt="20px" pb="20px">
        <Box className="container" pt={3} pb={0}>
          <Text
            textAlign="center"
            fontSize={30}
            pb="10px"
            id="features"
            scrollMarginBlock="0px"
          >
            Features
          </Text>
        </Box>

        <SimpleGrid
          className="container"
          columns={[1, 1, 3]}
          spacing={[5, 5, 5]}
          pt="0"
          pb="20px"
        >
          <Feature
            align="left"
            title="No data-binding"
            description="SpreadSheet Grid can work as a controlled and uncontrolled component. It renders based on the props just like any React component."
          />
          <Feature
            align="left"
            title="Frozen rows and columns"
            description="Freezing rows and columns is a breeze. You can customize this on for each sheet."
            url="/docs/freezing"
          />
          <Feature
            align="left"
            title="Autofilters"
            description="Filter views lets you slice and dice data right in the SpreadSheet Grid"
            url="/docs/autofilter"
          />
          <Feature
            align="left"
            title="Custom Editors"
            description="You can use your own React component as Cell Editors"
            url="/docs/editor"
          />
          <Feature
            align="left"
            title="Custom Cell Renderers"
            description="Using React Konva, you can declaratively render any canvas element on to SpreadSheet Grid."
            url="/docs/features/cell-renderer"
          />
          <Feature
            align="left"
            title="Data validation"
            description="Validate your data, prompting user to select from dropdown, datepicker, checkbox etc"
            url="/docs/features/data-validation"
          />
          <Feature
            align="left"
            title="Styling"
            description="Each cell in the grid can be customized as per your liking. Add borders, colors, stroke styles or custom gradients very easily."
            url="/docs/styles"
          />
          <Feature
            align="left"
            title="Copy/Paste/Cut and Undo/Redo"
            description="All operations have first-class support in SpreadSheet Grid."
            url="/docs/undo-redo"
          />
          <Feature
            align="left"
            title="Custom fonts"
            description="You can use any fonts in SpreadSheet Grid. It can be linked locally or loaded from Google fonts, typekit, fonts.com etc."
            url="/docs/features/fonts"
          />
          <Feature
            align="left"
            title="Context Menu"
            description="Either use the built-in Context Menu or easily switch to your own React Component"
            url="/docs/features/context-menu"
          />
          <Feature
            align="left"
            title="Merge cells"
            description="Merging multiple cells is a breeze. Use this to create nested or spanned headers or data."
            url="/docs/features/context-menu"
          />
          <Feature
            align="left"
            title="Export and Import Excel and CSV files"
            description="You are able to import any excel or csv files to SpreadSheet Grid. Exporting to the formats is also supported."
            url="/docs/excel"
          />
          <Feature
            align="left"
            title="Hide, Insert, Delete rows and columns"
            description="Rows and columns can be easily hidden or shown. Currently these functions are available in Context Menu or as Sheet Config"
            url="/docs/features/hidden-rows-columns"
          />
          <Feature
            align="left"
            title="Text Formatting"
            description="Full support for text formatting, just like Excel and Google sheets. Align, change fonts, make text bold, add underline or custom number format is very easy."
            url="/docs/styles"
          />
          <Feature
            align="left"
            title="Data types"
            description="SpreadSheet Grid supports numbers, string, checkbox, hyperlink, error, date (soon), rich text(soon), formula(soon)"
            url="/docs/features/datatypes"
          />
          <Feature
            align="left"
            title="Dark mode"
            description="Excel may not support it yet, But SpreadSheet Grid does. Switch to dark mode and start working on your datasheet at your convenience."
          />
          <Feature
            align="left"
            title="Outline/Grouping support (coming soon)"
            description="Allow collapsing rows and columns using native excel outline feature."
          />
          <Feature
            align="left"
            title="Filter sorting (coming soon)"
            description="Currently, sorting should be done outside SpreadSheet Grid, but core support is landing soon."
          />
          <Feature
            align="left"
            title="Conditional formatting (coming soon)"
            description="Currently conditional formatting can be done using a custom cell renderer. Core support will be available soon."
          />
          <Feature
            align="left"
            title="Formula (beta)"
            description="Make complex calculations, with cross-sheet references, external data source etc. High performance as calculations run in a separate thread."
            url="/docs/formula"
          />
        </SimpleGrid>
      </Box>
    </Layout>
  );
}

export default Home;
