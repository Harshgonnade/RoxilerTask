import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionsTable from "./components/TransactionsTable";
import StatisticsBox from "./components/StatisticsBox";
import BarChartComponent from "./components/BarChartComponent";
import Dropdown from "./components/Dropdown";
import SearchBar from "./components/SearchBar";

const App = () => {
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [month, search, page]);

  const fetchTransactions = async () => {
    const response = await axios.get("http://localhost:5000/api/products/transactions", {
      params: { month, search, page, perPage: 10 },
    });
    setTransactions(response.data.transactions);
  };

  const fetchStatistics = async () => {
    const response = await axios.get("http://localhost:5000/api/products/statistics", { params: { month } });
    setStatistics(response.data);
  };

  const fetchBarChartData = async () => {
    const response = await axios.get("http://localhost:5000/api/products/bar-chart", { params: { month } });
    setBarChartData(response.data);
  };

  return (
    <div className="container">
      <h1>Transaction Dashboard</h1>

      {/* Month Dropdown */}
      <Dropdown options={months} value={month} onChange={setMonth} />

      {/* Search Bar */}
      <SearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        page={page}
        onNext={() => setPage(page + 1)}
        onPrevious={() => setPage(page - 1)}
        canPrevious={page > 1}
      />

      {/* Statistics Box */}
      <StatisticsBox statistics={statistics} month={month} />

      {/* Bar Chart */}
      <BarChartComponent data={barChartData} month={month} />
    </div>
  );
};

export default App;
