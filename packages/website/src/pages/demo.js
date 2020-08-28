import React from "react";
import clsx from "clsx";
import Layout from "./../components/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import SpreadSheet, { uuid } from "@rowsncolumns/spreadsheet";
import { SimpleGrid, Box, Text, Button, List, ListItem } from "@chakra-ui/core";
import { Global, css } from "@emotion/core";

const initialState = [
  {
    name: "Sheet1",
    id: uuid(),
    activeCell: null,
    selections: [],
    mergedCells: [
      {
        top: 3,
        left: 4,
        right: 8,
        bottom: 3
      }
    ],
    rowSizes: {
      12: 60
    },
    cells: {
      2: {
        2: {
          text: "Hello world"
        },
        3: {
          text: "Tooltips",
          tooltip: "Thanks for the support. Spread the word!"
        }
      },
      3: {
        2: {
          text: "Black bg",
          fill: "#000000",
          color: "white"
        },
        4: {
          text: "Filter views",
          bold: true,
          fill: "#eeeeee"
        }
      },
      4: {
        2: {
          text: "Pink text",
          fill: "pink",
          color: "black"
        },
        4: {
          text: "First Name"
        },
        5: {
          text: "Last Name"
        },
        6: {
          text: "Gender"
        },
        7: {
          text: "Country"
        },
        8: {
          text: "Age"
        }
      },
      5: {
        2: {
          text: "#VALUE",
          valid: false,
          dataValidation: {
            prompt: "Select a country from the list",
            type: "list",
            formulae: ["Singapore", "China", "Japan", "USA"]
          }
        },
        4: {
          text: "Dulce"
        },
        5: {
          text: "Abril"
        },
        6: {
          text: "Female"
        },
        7: {
          text: "United States"
        },
        8: {
          text: "32",
          datatype: "number"
        }
      },
      6: {
        4: {
          text: "Mara"
        },
        5: {
          text: "Hashimoto"
        },
        6: {
          text: "Female"
        },
        7: {
          text: "Great Britain"
        },
        8: {
          text: "25",
          datatype: "number"
        }
      },
      7: {
        4: {
          text: "Philip"
        },
        5: {
          text: "Gent"
        },
        6: {
          text: "Male"
        },
        7: {
          text: "France"
        },
        8: {
          text: "36",
          datatype: "number"
        }
      },
      8: {
        2: {
          fill: "#4FC3F7"
        },
        4: {
          text: "Kathleen"
        },
        5: {
          text: "Hanner"
        },
        6: {
          text: "Female"
        },
        7: {
          text: "United States"
        },
        8: {
          text: "25",
          datatype: "number"
        }
      },
      9: {
        2: {
          fill: "#4FC3F7"
        },
        4: {
          text: "Loreta"
        },
        5: {
          text: "Curren"
        },
        6: {
          text: "Female"
        },
        7: {
          text: "France"
        },
        8: {
          text: "18",
          datatype: "number"
        }
      },
      10: {
        2: {
          text: "TRUE",
          datatype: "boolean",
          dataValidation: {
            allowBlank: true,
            type: "boolean",
            formulae: ["TRUE", "FALSE"]
          }
        },
        3: {
          text: "Checkboxes"
        },
        4: {
          text: "Belinda"
        },
        5: {
          text: "Partain"
        },
        6: {
          text: "Female"
        },
        7: {
          text: "Spain"
        },
        8: {
          text: "29",
          datatype: "number"
        }
      },
      11: {
        2: {
          datatype: "hyperlink",
          text: "Visit Google",
          color: "#1155CC",
          underline: true,
          hyperlink: "http://google.com"
        }
      },
      12: {
        2: {
          image: "https://picsum.photos/200/300"
        }
      }
    },
    filterViews: [
      {
        bounds: {
          top: 4,
          bottom: 20,
          left: 4,
          right: 8
        }
      }
    ]
  }
];

const formulas = {
  FETCH_CSV: async arg => {
    return fetch(arg.value)
      .then(r => r.text())
      .then(response => {
        const data = [];
        const rows = response.split("\n");
        for (const row of rows) {
          const cols = row.split(",");
          data.push(cols);
        }
        return data;
      });
  },
  FETCH_EXCHANGE_RATES: async () => {
    return fetch("https://api.exchangeratesapi.io/latest")
      .then(r => r.json())
      .then(response => {
        const data = [];
        const rates = response.rates;
        for (const currency in rates) {
          data.push([currency, rates[currency]]);
        }
        return data;
      });
  }
};

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
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
      <Global
        styles={css`
          .footer {
            display: none;
          }
          .main-wrapper {
            display: flex;
          }
        `}
      />
      <Box padding={2} flex={1} display="flex" minWidth={0}>
        <SpreadSheet
          initialColorMode="light"
          initialSheets={initialState}
          formulas={formulas}
        />
      </Box>
    </Layout>
  );
}

export default Home;
