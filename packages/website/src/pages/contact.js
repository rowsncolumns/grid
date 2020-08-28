import React from "react";
import clsx from "clsx";
import Layout from "./../components/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import {
  SimpleGrid,
  Box,
  Text,
  Button,
  List,
  ListItem,
  ListIcon,
  Flex
} from "@chakra-ui/core";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Contact" description="Contact rowsncolumns">
      <Box className="container" pt={10} display="block" pb={10}>
        <Text fontSize={30} fontWeight="bold" mb={5} as="h1">
          Contact us
        </Text>

        <Text mt={5} fontSize={20} fontWeight="bold" as="h2" mb={2}>
          Support
        </Text>

        <Button
          target="_blank"
          variantColor="green"
          _hover={{ color: "white" }}
          as="a"
          href="https://rowsncolumns.atlassian.net/servicedesk/customer/portal/3"
        >
          Submit a support ticket
        </Button>

        <Text mt={2} mb={2}>
          Or, email us at{" "}
          <a href="mailto:support@rowsncolumns.app">support@rowsncolumns.app</a>
        </Text>

        <Text fontSize={20} fontWeight="bold" as="h2" mb={1} mt={5}>
          Sales enquiries
        </Text>
        <Text>
          For sales enquiries, email us at{" "}
          <a href="mailto:sales@rowsncolumns.app">sales@rowsncolumns.app</a>
        </Text>
      </Box>
    </Layout>
  );
}

export default Home;
