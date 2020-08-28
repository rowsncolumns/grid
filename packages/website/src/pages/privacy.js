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
    <Layout title="Privacy" description="Privacy policy">
      <Box className="container" pt={10} display="block" pb={10}>
        <Text fontSize={24} mb={2}>
          Privacy Policy of <span class="website_url">Rows n' Columns</span>
        </Text>

        <Text mb={3}>
          At <span class="website_name">Rows n' Columns</span>, we collect and
          manage user data according to the following Privacy Policy.
        </Text>

        <Text fontSize={18} mb={2} mt={5}>
          Data Collected
        </Text>

        <Text mb={3}>
          We collect information you provide directly to us. For example, we
          collect information when you create an account, subscribe, participate
          in any interactive features of our services, fill out a form, request
          customer support or otherwise communicate with us. The types of
          information we may collect include your name, email address, postal
          address, credit card information and other contact or identifying
          information you choose to provide.
        </Text>

        <Text mb={3}>
          We collect anonymous data from every visitor of the Website to monitor
          traffic and fix bugs. For example, we collect information like web
          requests, the data sent in response to such requests, the Internet
          Protocol address, the browser type, the browser language, and a
          timestamp for the request.
        </Text>

        <Text mb={3}>
          We also use various technologies to collect information, and this may
          include sending cookies to your computer. Cookies are small data files
          stored on your hard drive or in your device memory that helps us to
          improve our services and your experience, see which areas and features
          of our services are popular and count visits. We may also collect
          information using web beacons (also known as "tracking pixels"). Web
          beacons are electronic images that may be used in our services or
          emails and to track count visits or understand usage and campaign
          effectiveness.
        </Text>

        <Text fontSize={18} mb={2} mt={5}>
          Use of the Data
        </Text>

        <Text mb={3}>
          We only use your personal information to provide you the{" "}
          <span class="website_name">Rows n' Columns</span> services or to
          communicate with you about the Website or the services. Our Privacy
          Policy was created with the help of the{" "}
          <a href="https://www.privacy-policy-template.com">
            Privacy Policy Template
          </a>{" "}
          and the{" "}
          <a href="https://www.termsandcondiitionssample.com">
            Terms and Conditions Template
          </a>
          .
        </Text>

        <Text mb={3}>
          We employ industry standard techniques to protect against unauthorized
          access of data about you that we store, including personal
          information.
        </Text>

        <Text mb={3}>
          We do not share personal information you have provided to us without
          your consent, unless:
        </Text>

        <Box as="ul" pl={5} mb={3}>
          <li>Doing so is appropriate to carry out your own request</li>
          <li>
            We believe it's needed to enforce our legal agreements or that is
            legally required
          </li>
          <li>
            We believe it's needed to detect, prevent or address fraud, security
            or technical issues
          </li>
        </Box>

        <Text fontSize={18} mb={2} mt={5}>
          Sharing of Data
        </Text>

        <Text mb={3}>
          We don't share your personal information with third parties.
          Aggregated, anonymized data is periodically transmitted to external
          services to help us improve the Website and service.
        </Text>

        <Text mb={3}>
          We may allow third parties to provide analytics services. These third
          parties may use cookies, web beacons and other technologies to collect
          information about your use of the services and other websites,
          including your IP address, web browser, pages viewed, time spent on
          pages, links clicked and conversion information.
        </Text>

        <Text mb={3}>
          We also use social buttons provided by services like Twitter, Google+,
          LinkedIn and Facebook. Your use of these third party services is
          entirely optional. We are not responsible for the privacy policies
          and/or practices of these third party services, and you are
          responsible for reading and understanding those third party services'
          privacy policies.
        </Text>

        <Text fontSize={18} mb={2} mt={5}>
          Cookies
        </Text>

        <Text mb={3}>
          We may use cookies on our site to remember your preferences.
        </Text>

        <Text mb={3}>
          For more general information on cookies, please read{" "}
          <a href="https://www.cookieconsent.com/what-are-cookies/">
            "What Are Cookies"
          </a>
          .
        </Text>

        <Text fontSize={18} mb={2} mt={5}>
          Opt-Out, Communication Preferences
        </Text>

        <Text mb={3}>
          You may modify your communication preferences and/or opt-out from
          specific communications at any time. Please specify and adjust your
          preferences.
        </Text>

        <Text fontSize={18} mb={2} mt={5}>
          Security
        </Text>

        <Text mb={3}>
          We take reasonable steps to protect personally identifiable
          information from loss, misuse, and unauthorized access, disclosure,
          alteration, or destruction. But, you should keep in mind that no
          Internet transmission is ever completely secure or error-free. In
          particular, email sent to or from the Sites may not be secure.
        </Text>

        <Text fontSize={18} mb={2} mt={5}>
          About Children
        </Text>

        <Text mb={3}>
          The Website is not intended for children under the age of 13. We do
          not knowingly collect personally identifiable information via the
          Website from visitors in this age group.
        </Text>

        <Text fontSize={18} mb={2} mt={5}>
          Changes to the Privacy Policy
        </Text>

        <Text mb={3}>
          We may amend this Privacy Policy from time to time. Use of information
          we collect now is subject to the Privacy Policy in effect at the time
          such information is used.
        </Text>

        <Text mb={3}>
          If we make major changes in the way we collect or use information, we
          will notify you by posting an announcement on the Website or sending
          you an email.
        </Text>
      </Box>
    </Layout>
  );
}

export default Home;
