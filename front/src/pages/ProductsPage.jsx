import React from 'react';
import Products from '../components/Products';

const ProductsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Our Products</h1>
      <Products />
    </div>
  );
};

export default ProductsPage;
