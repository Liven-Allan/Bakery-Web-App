import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getItemTransactions } from '../../layout/inventoryService';
import './TransactionModal.css'; // Ensure you have this CSS file

Modal.setAppElement('#root'); // For accessibility

const TransactionModal = ({ isOpen, onRequestClose, itemId }) => {
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    if (itemId) {
      getItemTransactions(itemId)
        .then(data => {
          setInventory(data.inventory);
          // Filter transactions to only include those for the selected item
          const filteredTransactions = data.transactions.filter(transaction => transaction.product === itemId);
          setTransactions(filteredTransactions);
        })
        .catch(error => console.error('Error fetching transactions:', error));
    }
  }, [itemId, isOpen]);

  // Function to calculate the total cost for a transaction
  const calculateTotalCost = (quantity, unitPrice) => {
    return (quantity * parseFloat(unitPrice)).toFixed(2);
  };

  // Process transactions to maintain running total
  const processTransactions = () => {
    let runningQuantity = 0;
    return transactions.map(transaction => {
      if (transaction.transaction_type === 'Addition') {
        runningQuantity += transaction.quantity;
      } else if (transaction.transaction_type === 'Update') {
        runningQuantity = transaction.quantity; // Update to new quantity
      }
      return {
        ...transaction,
        runningQuantity,
        totalCost: calculateTotalCost(runningQuantity, inventory.unit_price)
      };
    });
  };

  const processedTransactions = processTransactions();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Item Transactions"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <h2>Transaction Details</h2>
      </div>
      {inventory && (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Cost</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {processedTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{inventory.name}</td>
                <td>{transaction.runningQuantity}</td>
                <td>shs:{transaction.totalCost}</td>
                <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button type="button" className="close-button" onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default TransactionModal;
