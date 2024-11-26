import React from "react";

const StatisticsBox = ({ statistics, month }) => {
  return (
    <div>
      <h2>Statistics - {month}</h2>
      <p>Total Sale: {statistics.totalSalesAmount || 0}</p>
      <p>Total Sold Items: {statistics.totalSoldItems || 0}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems || 0}</p>
    </div>
  );
};

export default StatisticsBox;
