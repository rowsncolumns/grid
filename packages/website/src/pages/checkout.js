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
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./../components/CheckoutForm";
import "./checkout.css";

const promise = loadStripe(
  "pk_live_51H0px0J5hQpuPZLqXCjDMxmtkojRneJwiewLmwrSZy0EsL5ykRf7GxYAywugXVFSRCdEpPQAFdN8uSdLJolDy8vK00zL019VXW"
);

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Payment" description="Checkout">
      <Box className="container" pt={10} pb={10}>
        <Text fontSize={30} fontWeight="bold" mb={5} as="h1">
          Checkout
        </Text>
        <Text fontSize={20} mb={1}>
          SpreadSheet Grid Single Application License
        </Text>
        <Text mb={5}>
          <em>
            Allows one developer to use SpreadSheet Grid in one application.
          </em>
        </Text>
        <SimpleGrid columns={[1, 1, 1, 2]}>
          <Box mb={5} pr={5}>
            <Elements stripe={promise}>
              <CheckoutForm />
            </Elements>
          </Box>
          <Box mb={5}>
            <Box pb={4}>
              <img src="/img/payment-stripe.png" width="200" />
            </Box>
            <Text>After the payment is complete</Text>
            <List styleType="disc" pb={5}>
              <ListItem>A license key will be emailed to you.</ListItem>
              <ListItem>
                Email us at sales@rowsncolumns.app if you have any problems with
                the payment.
              </ListItem>
            </List>
          </Box>
        </SimpleGrid>
      </Box>
    </Layout>
  );
}

export default Home;
