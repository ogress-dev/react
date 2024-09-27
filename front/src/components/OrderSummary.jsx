import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const OrderSummary = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const data = orderSnap.data();
          console.log("Fetched order details: ", data); // Debug log
          setOrderDetails(data);
        } else {
          setError("Order not found!");
        }
      } catch (err) {
        console.error("Error fetching order details: ", err);
        setError("An error occurred while fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!orderDetails) {
    return <div>No order details available.</div>;
  }

  // Define styles for the PDF document
  const styles = StyleSheet.create({
    page: {
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    item: {
      marginBottom: 5,
    },
    image: {
      width: 50,
      height: 50,
      marginBottom: 5,
    },
    header: {
      fontSize: 20,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    totalAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    itemContainer: {
      marginBottom: 10,
    },
  });

  const PDFReceipt = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Order Summary</Text>
        <Text>Order ID: {orderId}</Text>
        <Text style={styles.totalAmount}>
          Total Amount: {orderDetails.currency} {orderDetails.totalAmount.toFixed(2)}
        </Text>
        <Text>Items:</Text>
        {orderDetails.items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image src={item.imageUrl || 'placeholder.png'} style={styles.image} />
            <Text>{item.name} - Quantity: {item.quantity}</Text>
            <Text>Price: {orderDetails.currency} {item.price.toFixed(2)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      <p className="text-lg font-semibold">Order ID: {orderId}</p>
      <p className="text-lg font-semibold">Total Amount: {orderDetails.currency} {orderDetails.totalAmount.toFixed(2)}</p>
      <h3 className="text-lg font-semibold mt-4">Items:</h3>
      <ul className="space-y-4">
        {orderDetails.items.map((item, index) => (
          <li key={index} className="flex items-center space-x-4">
            <img
              src={item.imageUrl || 'placeholder.png'}
              alt={item.name}
              className="w-16 h-16 object-cover"
              onError={(e) => e.target.src = 'placeholder.png'} // Use placeholder on error
            />
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-sm">Quantity: {item.quantity}</p>
              <p className="text-sm">Price: {orderDetails.currency} {item.price.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <PDFDownloadLink
          document={<PDFReceipt />}
          fileName={`order_${orderId}.pdf`}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {({ loading }) => (loading ? 'Generating PDF...' : 'Download Receipt as PDF')}
        </PDFDownloadLink>
      </div>
      <button
        onClick={() => navigate('/products')}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSummary;
