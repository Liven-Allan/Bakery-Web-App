// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Inventory Management Component 
//import Layout from './layout/Layout';
//import Dashboard from './layout/dashboard/Dashboard'; // Create this component
//import InventoryList from './layout/inventory_List/InventoryList'; // Create this component
//import InventoryReport from './layout/inventory_report/InventoryReport'; // Create this component

// Import Production Management components
import ProductionLayout from './production_layout/ProductionLayout';
import ProductionDashboard from './production_layout/production_dashboard/ProductionDashboard'; // Create this component
import ProductionList from './production_layout/production_list/ProductionList'; // Create this component
import ProductionReport from './production_layout/production_report/ProductionReport'; // Create this component


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<ProductionLayout />}>
          <Route path="production-dashboard" element={<ProductionDashboard />} />
          <Route path="production-list" element={<ProductionList />} />
          <Route path="production-report" element={<ProductionReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

//import Layout from './layout/Layout';
//import Dashboard from './layout/dashboard/Dashboard'; // Create this component
//import InventoryList from './layout/inventory_List/InventoryList'; // Create this component
//import InventoryReport from './layout/inventory_report/InventoryReport'; // Create this component


 /*{
        
}*/
/*<Route path="/" element={<ProductionLayout />}>
          <Route path="production-dashboard" element={<ProductionDashboard />} />
          <Route path="production-list" element={<ProductionList />} />
          <Route path="production-report" element={<ProductionReport />} />
        </Route>*/ 