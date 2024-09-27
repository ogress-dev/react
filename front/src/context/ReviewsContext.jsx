import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';

const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const fetchReviews = async () => {
    const reviewsCollection = collection(db, 'reviews');
    const reviewsQuery = query(reviewsCollection, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(reviewsQuery);
    const reviewsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReviews(reviewsList);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = async (name, reviewText) => {
    await addDoc(collection(db, 'reviews'), {
      name,
      review: reviewText,
      timestamp: new Date()
    });
    fetchReviews();
  };

  const nextReview = () => {
    if (currentReviewIndex < reviews.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    }
  };

  const prevReview = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1);
    }
  };

  return (
    <ReviewsContext.Provider value={{ reviews, currentReviewIndex, nextReview, prevReview, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewsContext);
