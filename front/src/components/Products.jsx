import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../context/CartContexts';
import QuantityModal from './QuantityModal';
import ImageModal from './ImageModal'; // Import the new ImageModal component

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalIsOpen(true);
  };

  const closeImageModal = () => {
    setImageModalIsOpen(false);
    setSelectedImage(null);
  };

  const handleAddToCart = (product, quantity) => {
    addToCart({ ...product, quantity });
    //alert(`Added ${quantity} piece(s) of ${product.name} to the cart.`);
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-32 object-cover mb-4 rounded cursor-pointer"
              onClick={() => openImageModal(product.imageUrl)}
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-1">${product.price?.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{product.description}</p> {/* Add this line for description */}
            <button
              onClick={() => openModal(product)}
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
            >
              Add to Cart
            </button>
          </div>
        ))
      )}

      {selectedProduct && (
        <QuantityModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}

      {selectedImage && (
        <ImageModal
          isOpen={imageModalIsOpen}
          onRequestClose={closeImageModal}
          imageUrl={selectedImage}
          altText={selectedProduct?.name || 'Product Image'}
        />
      )}
    </div>
  );
};

export default Products;
