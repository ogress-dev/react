import React from 'react';
import ReactModal from 'react-modal';

const ImageModal = ({ isOpen, onRequestClose, imageUrl, altText }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="relative bg-white p-4 rounded-lg max-w-3xl mx-auto">
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2"
        >
          &times;
        </button>
        <img src={imageUrl} alt={altText} className="w-full h-auto" />
      </div>
    </ReactModal>
  );
};

export default ImageModal;
