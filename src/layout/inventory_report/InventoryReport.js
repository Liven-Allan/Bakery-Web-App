// src/layout/inventory_report/InventoryReport.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './InventoryReport.css';

const InventoryReport = () => {
  const [dates, setDates] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/historical-data/');
        const fetchedData = response.data;

        // Extract unique dates
        const uniqueDates = [...new Set(fetchedData.map(item => item.date))];
        setDates(uniqueDates);

        // Store data for use in PDF generation
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchData();
  }, []);

  const generatePDF = (date) => {
    const doc = new jsPDF();

    // Filter data for the selected date
    const filteredData = data.filter(item => item.date === date);

    // Create table for PDF
    const tableData = filteredData.map(item => [
      item.product,
      item.unit_price,
      item.quantity,
      (item.unit_price * item.quantity).toFixed(2)
    ]);

    const total = tableData.reduce((sum, row) => sum + parseFloat(row[3]), 0).toFixed(2);

    doc.text('Inventory Report', 14, 16);
    doc.text(`Date: ${date}`, 14, 24);

    doc.autoTable({
      startY: 32,
      head: [['Product', 'Unit Price', 'Quantity', 'Total Price']],
      body: tableData,
    });

    doc.text(`Overall Total Price: ${total}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`inventory_report_${date}.pdf`);
  };

  return (
    <div className="inventory-report-container">
      <h2>Inventory Report</h2>
      <table className="inventory-report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Export</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((date, index) => (
            <tr key={index}>
              <td>{date}</td>
              <td>
                <button className="export-button" onClick={() => generatePDF(date)}>Export</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryReport;
