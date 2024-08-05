/* src/layout/dashboard/Dashboard.js */

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [totalCosts, setTotalCosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/historical-data/');
        const fetchedData = response.data;

        // Aggregate data by date and calculate total quantity
        const aggregatedData = {};
        fetchedData.forEach(item => {
          const { date, product, quantity, unit_price } = item;
          if (!aggregatedData[date]) {
            aggregatedData[date] = {
              products: {},
              total_cost: 0
            };
          }
          if (!aggregatedData[date].products[product]) {
            aggregatedData[date].products[product] = 0;
          }
          aggregatedData[date].products[product] += quantity;
          aggregatedData[date].total_cost += quantity * parseFloat(unit_price);
        });

        // Convert aggregated data to array format for the line chart
        const formattedData = Object.entries(aggregatedData).map(([date, values]) => ({
          date,
          total_quantity: Object.values(values.products).reduce((a, b) => a + b, 0),
        }));
        setData(formattedData);

        // Convert aggregated data to array format for the stock levels table
        const formattedStockLevels = Object.entries(aggregatedData).flatMap(([date, values]) =>
          Object.entries(values.products).map(([product, quantity]) => ({
            date,
            product,
            quantity,
          }))
        );
        setStockLevels(formattedStockLevels);

        // Convert aggregated data to array format for the total cost view
        const formattedTotalCosts = Object.entries(aggregatedData).map(([date, values]) => ({
          date,
          total_cost: values.total_cost.toFixed(2),  // Format as a fixed-point number
        }));
        setTotalCosts(formattedTotalCosts);

      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchData();
  }, []);


  // Custom tooltip content for line chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, total_quantity } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Date: ${date}`}</p>
          <p>{`Total Quantity: ${total_quantity}`}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="dashboard">
       <h2>Dashboard</h2>
      <div className="chart-container">
      <h2>Inventory Trends Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="total_quantity" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="stock-levels-container">
        <h2>Stock Levels</h2>
        <table className="stock-levels-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity (Kgs|Pcs|Ltr)</th>
            </tr>
          </thead>
          <tbody>
            {stockLevels.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.product}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="total-costs-container">
        <h2>Total Costs</h2>
        <table className="total-costs-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {totalCosts.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>shs:{item.total_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
