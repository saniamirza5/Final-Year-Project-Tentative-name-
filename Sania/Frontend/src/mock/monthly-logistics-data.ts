export type LogisticsStatusKey = "delivered" | "inTransit" | "delayed" | "atRisk" | "returned";

export type LogisticsSlice = {
  key: LogisticsStatusKey;
  name: string;
  value: number;
  operationalNote: string;
};

export type MonthLogisticsEntry = {
  id: string;
  label: string;
  slices: LogisticsSlice[];
  footerInsight: string;
};

/** Month-keyed shipment mix for the overview pie chart (totals vary by month). */
export const monthlyLogisticsByMonth: Record<string, MonthLogisticsEntry> = {
  january: {
    id: "january",
    label: "January",
    footerInsight: "On-time delivery improved by 6.2% this month",
    slices: [
      { key: "delivered", name: "Delivered", value: 834, operationalNote: "ETA confidence: High" },
      { key: "inTransit", name: "In Transit", value: 231, operationalNote: "Lane utilization: Normal" },
      { key: "delayed", name: "Delayed", value: 128, operationalNote: "ETA confidence: Medium" },
      { key: "atRisk", name: "At Risk", value: 51, operationalNote: "ETA confidence: Low" },
      { key: "returned", name: "Returned", value: 40, operationalNote: "RMA rate within SLA" },
    ],
  },
  february: {
    id: "february",
    label: "February",
    footerInsight: "In-transit volume normalized after holiday surge",
    slices: [
      { key: "delivered", name: "Delivered", value: 798, operationalNote: "ETA confidence: High" },
      { key: "inTransit", name: "In Transit", value: 256, operationalNote: "ETA confidence: Medium" },
      { key: "delayed", name: "Delayed", value: 142, operationalNote: "Weather-related delays, Midwest" },
      { key: "atRisk", name: "At Risk", value: 62, operationalNote: "ETA confidence: Medium" },
      { key: "returned", name: "Returned", value: 44, operationalNote: "Returns stable vs. January" },
    ],
  },
  march: {
    id: "march",
    label: "March",
    footerInsight: "Carrier scorecards show 3% faster dwell at primary hubs",
    slices: [
      { key: "delivered", name: "Delivered", value: 856, operationalNote: "ETA confidence: High" },
      { key: "inTransit", name: "In Transit", value: 218, operationalNote: "ETA confidence: High" },
      { key: "delayed", name: "Delayed", value: 104, operationalNote: "ETA confidence: Medium" },
      { key: "atRisk", name: "At Risk", value: 48, operationalNote: "ETA confidence: Medium" },
      { key: "returned", name: "Returned", value: 36, operationalNote: "Quality holds reduced returns" },
    ],
  },
  april: {
    id: "april",
    label: "April",
    footerInsight: "At-risk shipments down 9% after routing policy refresh",
    slices: [
      { key: "delivered", name: "Delivered", value: 812, operationalNote: "ETA confidence: High" },
      { key: "inTransit", name: "In Transit", value: 244, operationalNote: "ETA confidence: Medium" },
      { key: "delayed", name: "Delayed", value: 118, operationalNote: "ETA confidence: Medium" },
      { key: "atRisk", name: "At Risk", value: 55, operationalNote: "ETA confidence: Low" },
      { key: "returned", name: "Returned", value: 39, operationalNote: "RMA rate within SLA" },
    ],
  },
  may: {
    id: "may",
    label: "May",
    footerInsight: "Delivered share increased 2.1 pp week-over-week",
    slices: [
      { key: "delivered", name: "Delivered", value: 889, operationalNote: "ETA confidence: High" },
      { key: "inTransit", name: "In Transit", value: 201, operationalNote: "ETA confidence: High" },
      { key: "delayed", name: "Delayed", value: 96, operationalNote: "ETA confidence: High" },
      { key: "atRisk", name: "At Risk", value: 42, operationalNote: "ETA confidence: Medium" },
      { key: "returned", name: "Returned", value: 34, operationalNote: "Returns below 90d average" },
    ],
  },
  june: {
    id: "june",
    label: "June",
    footerInsight: "End-of-quarter volume absorbed with no SLA regression",
    slices: [
      { key: "delivered", name: "Delivered", value: 902, operationalNote: "ETA confidence: High" },
      { key: "inTransit", name: "In Transit", value: 228, operationalNote: "ETA confidence: Medium" },
      { key: "delayed", name: "Delayed", value: 88, operationalNote: "ETA confidence: Medium" },
      { key: "atRisk", name: "At Risk", value: 38, operationalNote: "ETA confidence: Medium" },
      { key: "returned", name: "Returned", value: 31, operationalNote: "RMA rate within SLA" },
    ],
  },
};

export const logisticsMonthOrder = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
] as const;

export type LogisticsMonthId = (typeof logisticsMonthOrder)[number];
