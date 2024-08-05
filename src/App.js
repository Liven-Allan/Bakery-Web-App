// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './layout/dashboard/Dashboard'; // Create this component
import InventoryList from './layout/inventory_List/InventoryList'; // Create this component
import InventoryReport from './layout/inventory_report/InventoryReport'; // Create this component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory-list" element={<InventoryList />} />
          <Route path="inventory-report" element={<InventoryReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;



/*
import './App.css';
import InventoryManagement from './InventoryManagement/InventoryManagement'; // Import the new component


function App() {
  return (
    <div className="App">
      <InventoryManagement />
    </div>
  );
}

export default App;
*/