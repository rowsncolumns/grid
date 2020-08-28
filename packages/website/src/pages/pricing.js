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
  Flex,
} from "@chakra-ui/core";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Pricing" description="SpreadSheets pricing">
      <Box className="container" pt={10}>
        <Text
          textAlign="center"
          as="h1"
          fontWeight="bold"
          fontSize="3xl"
          pb={5}
        >
          SpreadSheet Pricing
        </Text>
        <SimpleGrid
          columns={[1, 1, 2]}
          width={["auto", "auto", 800]}
          margin="auto"
          spacing={10}
          alignItem="center"
        >
          <Box shadow="md" p={4} mb={5}>
            <Box textAlign="center">
              <Text fontWeight="bold" pb={5} fontSize="2xl">
                Non-commercial
              </Text>
              <Text fontSize="xl">Free</Text>
            </Box>

            <List pt={5} maxWidth={300} margin="auto">
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  Non-commerical use. Perfect for open source and hobby projects
                </Flex>
              </ListItem>
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  Community support
                </Flex>
              </ListItem>
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  All features
                </Flex>
              </ListItem>
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  Source code available
                </Flex>
              </ListItem>
            </List>
          </Box>
          <Box shadow="md" p={4} mb={5}>
            <Box textAlign="center">
              <Text fontWeight="bold" pb={5} fontSize="2xl">
                Developer license
              </Text>
              <Text fontSize="xl">US $199 / developer</Text>
            </Box>

            <List pt={5} pb={8} maxWidth={300} margin="auto">
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  Commercial use
                </Flex>
              </ListItem>
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  Single application
                </Flex>
              </ListItem>
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  Perpetual license
                </Flex>
              </ListItem>
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  All features
                </Flex>
              </ListItem>
              <ListItem pb={2}>
                <Flex>
                  <ListIcon mt={1} icon="check-circle" color="green.500" />
                  Source code available
                </Flex>
              </ListItem>
              <ListItem pb={2}>
                <Flex>
                  <ListIcon icon="check-circle" color="green.500" />1 year of
                  FREE support from the Core team.
                </Flex>
              </ListItem>
            </List>

            <Button
              variantColor="purple"
              width={200}
              margin="auto"
              display="block"
              textAlign="center"
              // href="/checkout"
              isDisabled
              as="a"
              lineHeight="40px"
              mb={5}
              _hover={{
                color: "white",
                opacity: 0.9,
                textDecoration: "none",
              }}
            >
              Buy
            </Button>
          </Box>
        </SimpleGrid>
        <Box
          className="admonition admonition-note alert alert--secondary"
          margin="auto"
          mb="20px"
          width={["auto", "auto", 800]}
        >
          <div className="admonition-heading">
            <h5>
              <span class="admonition-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"
                  ></path>
                </svg>
              </span>
              note
            </h5>
          </div>
          <div className="admonition-content">
            Learn more about available <a href="/docs/license">licenses</a>
          </div>
        </Box>
      </Box>
    </Layout>
  );
}

export default Home;
