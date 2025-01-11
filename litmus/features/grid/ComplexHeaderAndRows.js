import { Chart, Gridlines, LineGraph, NumericAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller } from "cx/ui";
import { Button, Grid, HtmlElement, NumberField, TextField } from "cx/widgets";

class PageController extends Controller {
   onInit() {
      if (!this.store.get("$page.records")) this.loadRecords();
   }

   loadRecords() {
      this.store.set("proposal", {
         portfolio: {
            currency: "CHF",
         },
         orders: [
            {
               transactionType: "buy",
               asset: {
                  isin: "SG3261987691",
                  name: "Singapore Government of 3.375 2033-09-01",
                  currency: "SGD",
               },
               quantity: 8073000,
               assetPriceInCashCurrency: 0.66427,
               marketValue: 1903.2,
               fees: {
                  internalFees: {
                     value: 53626.76,
                  },
                  externalFees: {
                     value: 0.01,
                  },
               },
               kne: true,
               class: "Obligation",
            },
            {
               transactionType: "sell",
               asset: {
                  isin: "US02079K3059",
                  name: "Alphabet Inc. Class A",
                  currency: "USD",
               },
               quantity: -50,
               assetPriceInCashCurrency: 137.58,
               marketValue: -6259.2,
               fees: {
                  internalFees: {
                     value: 62.59,
                  },
                  externalFees: {
                     value: 0.01,
                  },
               },
               kne: false,
               class: "Capitaux propres",
            },
            {
               transactionType: "sell",
               asset: {
                  isin: "SG1L01001701",
                  name: "DBS Group Holdings Ltd",
                  currency: "SGD",
               },
               quantity: -1000,
               assetPriceInCashCurrency: 33.58,
               marketValue: -22385.85,
               fees: {
                  internalFees: {
                     value: 223.86,
                  },
                  externalFees: {
                     value: 0.01,
                  },
               },
               kne: true,
               class: "Capitaux propres",
            },
            {
               transactionType: "sell",
               asset: {
                  isin: "SG1T56930848",
                  name: "Wilmar International Limited",
                  currency: "SGD",
               },
               quantity: -50000,
               assetPriceInCashCurrency: 3.63,
               marketValue: -120995.57,
               fees: {
                  internalFees: {
                     value: 1209.96,
                  },
                  externalFees: {
                     value: 0.01,
                  },
               },
               kne: true,
               class: "Capitaux propres",
            },
         ],
      });
   }
}

export default (
   <cx>
      <Grid
         controller={PageController}
         records-bind="proposal.orders"
         row={{
            line1: {
               columns: [
                  {
                     header: {
                        text: "Designation",
                     },
                     field: "asset.name",
                     sortable: true,
                     style: "font-weight: bold",
                  },
                  {
                     header: {
                        text: "Class d'actif",
                        rowSpan: 3,
                     },
                     field: "class",
                     sortable: true,
                     align: "center",
                     style: "vertical-align: top",
                     rowSpan: 2,
                  },
                  {
                     header: { text: "Monnaie", rowSpan: 3 },
                     field: "asset.currency",
                     sortable: true,
                     align: "center",
                     style: "vertical-align: top",
                     rowSpan: 2,
                  },
                  {
                     header: {
                        text: "Quantite",
                        rowSpan: 3,
                     },
                     field: "quantity",
                     sortable: true,
                     align: "right",
                     format: "n;2",
                     style: "vertical-align: top; background-color: #f4f4f4",
                     rowSpan: 2,
                  },
                  {
                     header: { text: "Prix", rowSpan: 3 },
                     field: "assetPriceInCashCurrency",
                     sortable: true,
                     align: "right",
                     format: "n;2",
                     style: "vertical-align: top; background-color: #f4f4f4",
                     rowSpan: 2,
                  },
                  {
                     header: { text: "Montant", rowSpan: 3 },
                     field: "marketValue",
                     sortable: true,
                     align: "right",
                     format: "n;2",
                     style: "vertical-align: top; background-color: #f4f4f4",
                     rowSpan: 2,
                  },
                  {
                     header: { text: "Frais internes", rowSpan: 2 },
                     field: "fees.internalFees.value",
                     align: "right",
                     format: "n;2",
                     rowSpan: 2,
                  },
                  {
                     header: { text: "C/E", rowSpan: 2 },
                     field: "kne",
                     value: { expr: "{$record.kne} ? 'yes' : 'no'" },
                     style: "vertical-align: top",
                     rowSpan: 2,
                  },
                  {
                     header: { text: "Univers", rowSpan: 3 },
                     field: "univers",
                     rowSpan: 2,
                  },
                  {
                     header: { text: "Initie Par", rowSpan: 3 },
                     field: "initiatedBy",
                     rowSpan: 2,
                  },
               ],
            },
            line2: {
               columns: [
                  {
                     header: {
                        text: "ISIN",
                        rowSpan: 2,
                     },
                     field: "asset.isin",
                     sortable: true,
                  },
                  {
                     header: {
                        text: "Frais externes",
                     },
                     field: "fees.externalFees.value",
                     align: "right",
                     format: "n;2",
                     header2: "CHF",
                  },
               ],
            },
         }}
      />
      ;
   </cx>
);
