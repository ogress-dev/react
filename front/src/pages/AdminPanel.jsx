import React, { useState, useEffect } from 'react';
import { db, storage } from '../utils/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch products from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevData => ({ ...prevData, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = '';
      if (formData.image) {
        const imageRef = ref(storage, `images/${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (editingProductId) {
        // Update existing product
        const productRef = doc(db, 'products', editingProductId);
        await updateDoc(productRef, {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          ...(imageUrl && { imageUrl })
        });
        alert('Product updated successfully!');
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          imageUrl: imageUrl
        });
        alert('Product uploaded successfully!');
      }

      // Reset form
      setFormData({ name: '', price: '', description: '', image: null });
      setEditingProductId(null);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error uploading/updating product: ", error);
      alert('Error uploading or updating product');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: null // Only update image if a new one is uploaded
    });
    setEditingProductId(product.id);
  };

  const handleDelete = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Delete product from Firestore
        const productRef = doc(db, 'products', product.id);
        await deleteDoc(productRef);

        // Delete image from Firebase Storage
        const imageRef = ref(storage, product.imageUrl);
        await deleteObject(imageRef);

        // Update local product list
        setProducts(products.filter(p => p.id !== product.id));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            className="mt-1 block w-full text-gray-700"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : editingProductId ? 'Update Product' : 'Upload Product'}
        </button>
      </form>

      {/* Product List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Uploaded Products</h2>
        {products.length === 0 ? (
          <p>No products uploaded yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {products.map(product => (
              <li key={product.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p>Price: ${product.price}</p>
                  <p>{product.description}</p>
                  <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover mt-2" />
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
