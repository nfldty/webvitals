import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const formatMetricName = (name) => {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

const formatClickStatistics = (clickStats) => {
  if (!clickStats) return [];
  return Object.entries(clickStats).map(([key, value]) => [
    formatMetricName(key),
    `${value.count} (${value.percentage})`,
  ]);
};

const formatTraffic = (trafficArray) => {
  if (!trafficArray || trafficArray.length === 0) return "None";
  return trafficArray.map((item) => {
    const count = item._count?.pageUrl || 0;
    const visitText = count === 1 ? "visit" : "visits";
    return `${item.pageUrl} (${count} ${visitText})`;
  });
};

const formatExtraData = (extraData) => {
  if (!extraData) return [];

  return Object.entries(extraData).map(([key, values]) => {
    const formattedKey = formatMetricName(key);

    let formattedValue = '';
    
    if (key === "browserUsage") {
      // Format browser data
      formattedValue = values
        .map((item) => `${item.browserName} (${item.count} ${item.count === 1 ? "visit" : "visits"} - ${item.percentage})`)
        .join(", ");
    } else if (key === "operatingSystemUsage") {
      // Format OS data
      formattedValue = values
        .map((item) => `${item.operatingSystem} (${item.count} ${item.count === 1 ? "visit" : "visits"} - ${item.percentage})`)
        .join(", ");
    } else if (key === "isMobileUsage") {
      // Format mobile data (True/False)
      formattedValue = values
        .map((item) => `${item.isMobile ? "Mobile" : "Desktop"} (${item.count} ${item.count === 1 ? "visit" : "visits"} - ${item.percentage})`)
        .join(", ");
    } else if (key === "referrerUsage") {
      // Format referrer data
      formattedValue = values
        .map((item) => `${item.referrer || 'Direct'} (${item.count} ${item.count === 1 ? "visit" : "visits"} - ${item.percentage})`)
        .join(", ");
    }

    return [formattedKey, formattedValue];
  });
};

export default function ExportMetrics({ data }) {
  if (!data) return null;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Statistics Report", 10, 10);

    const tableData = Object.entries(data).flatMap(([key, value]) => {
      if (key === "liveUsers") return [];
      if (key === "clickStatistics") return formatClickStatistics(value);
      if (key === "mostTraffic") return [["Most Traffic", formatTraffic(value)]];
      if (key === "leastTraffic") return [["Least Traffic", formatTraffic(value)]];
      if (key === "extraData") return formatExtraData(value);
      return [[formatMetricName(key), String(value)]];
    });

    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: tableData,
    });

    doc.save("report.pdf");
  };

  const exportCSV = () => {
    const formattedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return [formatMetricName(key), JSON.stringify(value)];
        }
        return [formatMetricName(key), value];
      })
    );

    const csv = Papa.unparse([formattedData]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "report.csv");
  };

  return (
    <div className="export-buttons" style={{ display: 'flex', gap: '10px' }}>
      <div>
        <button onClick={exportPDF}>Export as PDF</button>
      </div>
      <div>
        <button onClick={exportCSV}>Export as CSV</button>
      </div>
    </div>
  );
}
