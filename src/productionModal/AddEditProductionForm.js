// src/production_layout/productionModal/AddEditProductionForm.js

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './AddEditProductionForm.css';

const AddEditProductionForm = ({ production, onSave, onCancel }) => {
  const [productName, setProductName] = useState(production ? production.productName : '');
  const [rawMaterials, setRawMaterials] = useState(production ? production.rawMaterials.map(material => ({
    value: material.id,
    label: material.name,
    quantity: material.quantity
  })) : []);
  const [quantityProduced, setQuantityProduced] = useState(production ? production.quantityProduced : '');
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    // Fetch inventory items from the server
    axios.get('http://localhost:8000/api/inventory/')
      .then(response => {
        // Map response data to react-select options
        const options = response.data.map(item => ({
          value: item.id,
          label: item.name
        }));
        setInventoryItems(options);
      })
      .catch(error => {
        console.error('Error fetching inventory items:', error);
      });

    if (production) {
      setProductName(production.productName);
      setRawMaterials(production.rawMaterials.map(material => ({
        value: material.id,
        label: material.name,
        quantity: material.quantity || 0 // Default quantity if not provided
      })));
      setQuantityProduced(production.quantityProduced);
    }
  }, [production]);

  const handleRawMaterialsChange = (selectedOptions) => {
    // Ensure selected options are updated and maintain quantities
    setRawMaterials(selectedOptions.map(option => ({
      value: option.value,
      label: option.label,
      quantity: rawMaterials.find(material => material.value === option.value)?.quantity || 0
    })));
  };

  const handleQuantityChange = (index, value) => {
    const updatedMaterials = [...rawMaterials];
    updatedMaterials[index].quantity = parseFloat(value) || 0; // Ensure quantity is a number
    setRawMaterials(updatedMaterials);
  };

  const handleSave = () => {
    // Extract only the raw material IDs
    const rawMaterialIDs = rawMaterials.map(material => material.value);

    // Extract quantities to match the expected format
    const quantitiesUsed = rawMaterials.map(material => material.quantity);

    const newProduction = {
      id: production ? production.id : null,
      productName,
      rawMaterials: rawMaterialIDs, // Send an array of IDs
      quantityProduced: parseFloat(quantityProduced) || 0, // Ensure quantityProduced is a number
      quantityUsed: quantitiesUsed // Send array of quantities
    };

    // Pass the newProduction object to the onSave callback
    onSave(newProduction);
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <h2>{production ? 'Edit Production Record' : 'Add New Production Record'}</h2>
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter Product Name"
          />
        </div>
        <div className="form-group">
          <label>Raw Materials:</label>
          <Select
            isMulti
            options={inventoryItems}
            value={rawMaterials.map(material => ({
              value: material.value,
              label: material.label
            }))}
            onChange={handleRawMaterialsChange}
          />
          {rawMaterials.map((material, index) => (
            <div key={index} className="form-group">
              <label>Quantity for {material.label}:</label>
              <input
                type="number"
                value={material.quantity || ''}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                placeholder="Enter Quantity"
              />
            </div>
          ))}
        </div>
        <div className="form-group">
          <label>Quantity Produced:</label>
          <input
            type="number"
            value={quantityProduced}
            onChange={(e) => setQuantityProduced(e.target.value)}
            placeholder="Enter Quantity Produced"
          />
        </div>
        <div className="form-buttons">
          <button onClick={handleSave}>{production ? 'Update' : 'Save'}</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductionForm;
