// src/components/QuantityModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ensure to bind the modal to the root element

const QuantityModal = ({ isOpen, onRequestClose, product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart(product, quantity);
      onRequestClose();
    } else {
      alert('Please enter a valid quantity.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Quantity Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-content">
        <h2 className="text-xl font-semibold mb-4">Enter Quantity for {product.name}</h2>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-between">
          <button
            onClick={handleAddToCart}
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
          >
            Add to Cart
          </button>
          <button
            onClick={onRequestClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QuantityModal;
