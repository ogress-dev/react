import React, { useState, useEffect } from 'react';
import { db, storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // Fetch uploaded items from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const handleUpload = async () => {
    if (!file || !name || !price || !description) {
      setError('All fields are required');
      return;
    }
    setUploading(true);

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // Save image info to Firestore
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        description,
        imageUrl,
      });

      // Fetch updated products list
      fetchProducts();

      // Reset fields
      resetFields();
    } catch (err) {
      setError('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    try {
      // Delete from Firebase Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Delete from Firestore
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);

      // Remove from local state
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError('Error deleting file');
    }
  };

  const handleUpdate = async (id) => {
    if (!price || !description) {
      setError('Price and description are required for update');
      return;
    }

    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        price: parseFloat(price),
        description,
      });

      // Update local state
      setProducts(products.map(product => 
        product.id === id ? { ...product, price: parseFloat(price), description } : product
      ));
      resetFields(); // Reset the fields after updating
    } catch (err) {
      setError('Error updating file');
    }
  };

  const resetFields = () => {
    setFile(null);
    setName('');
    setPrice('');
    setDescription('');
    setError('');
  };

  return (
    <div>
      <h1>Upload Image</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input 
        type="file" 
        onChange={e => setFile(e.target.files[0])} 
      />
      <input 
        type="text" 
        placeholder="Image Name" 
        value={name} 
        onChange={e => setName(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Price in USD" 
        value={price} 
        onChange={e => setPrice(e.target.value)} 
      />
      <textarea 
        placeholder="Description" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      <h2>Uploaded Products</h2>
      <div>
        {products.map(product => (
          <div key={product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <img src={product.imageUrl} alt={product.name} width="100" style={{ marginRight: '10px' }} />
            <div style={{ marginRight: '10px' }}>
              <p>{product.name}</p>
              <p>{product.price} USD</p>
              <p>{product.description}</p>
              <button onClick={() => handleDelete(product.id, product.imageUrl)}>Delete</button>
            </div>
            <div>
              <input 
                type="number" 
                placeholder="Update Price" 
                onChange={e => setPrice(e.target.value)} 
              />
              <textarea 
                placeholder="Update Description" 
                onChange={e => setDescription(e.target.value)} 
              />
              <button onClick={() => handleUpdate(product.id)}>Update</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadImage;
