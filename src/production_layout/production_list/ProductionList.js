// src/production_layout/production_list/ProductionList.js

// src/production_layout/production_list/ProductionList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEditProductionForm from '../../productionModal/AddEditProductionForm';
import './ProductionList.css';

const API_URL_PRODUCTIONS = 'http://localhost:8000/api/productions/';
const API_URL_INVENTORY = 'http://localhost:8000/api/inventory/';

const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [editingProduction, setEditingProduction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProductions = async () => {
    try {
      const response = await axios.get(API_URL_PRODUCTIONS);
      console.log('Fetched productions:', response.data);
      setProductions(response.data);
    } catch (error) {
      console.error('Error fetching productions:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(API_URL_INVENTORY);
      console.log('Fetched inventory items:', response.data);
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  useEffect(() => {
    fetchProductions();
    fetchInventoryItems();
  }, []);

  const handleAddClick = () => {
    setEditingProduction(null);
    setShowForm(true);
  };

  const handleEditClick = (production) => {
    setEditingProduction(production);
    setShowForm(true);
  };

  const handleSave = async (production) => {
    try {
      // Ensure quantityUsed is an array
      if (production.quantityUsed && !Array.isArray(production.quantityUsed)) {
        production.quantityUsed = [production.quantityUsed];
      } else if (!production.quantityUsed) {
        production.quantityUsed = [];
      }

      if (editingProduction) {
        // Update an existing record
        await axios.put(`${API_URL_PRODUCTIONS}${editingProduction.id}/`, production);
      } else {
        // Create a new record
        await axios.post(API_URL_PRODUCTIONS, production);
      }

      // Refresh the production list and close the form
      fetchProductions();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving production record:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDelete = async (productionID) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${API_URL_PRODUCTIONS}${productionID}/`);
        fetchProductions();
      } catch (error) {
        console.error('Error deleting production record:', error);
      }
    }
  };

  const getRawMaterialDetails = (rawMaterials) => {
    return rawMaterials.map(materialId => {
      const item = inventoryItems.find(i => i.id === materialId);
      return item ? item.name : 'Unknown';
    });
  };

  return (
    <div>
      <h2>Production List</h2>
      <button onClick={handleAddClick}>Add New Production Record</button>
      {showForm && (
        <AddEditProductionForm
          production={editingProduction}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Raw Materials</th>
            <th>Quantity Used</th>
            <th>Quantity Produced</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productions.map(record => (
            <tr key={record.id}>
              <td>{record.productName}</td>
              <td>
                <ul className="vertical-list">
                  {getRawMaterialDetails(record.rawMaterials).map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="vertical-list">
                  {record.quantityUsed.map((quantity, index) => (
                    <li key={index}>{quantity}</li>
                  ))}
                </ul>
              </td>
              <td>{record.quantityProduced}</td>
              <td>
                <button onClick={() => handleEditClick(record)}>Edit</button>
                <button onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionList;
