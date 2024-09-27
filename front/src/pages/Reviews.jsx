import React, { useState } from 'react';
import { useReviews } from '../context/ReviewsContext';

const Reviews = () => {
  const { reviews, currentReviewIndex, nextReview, prevReview, addReview } = useReviews();
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addReview(name, reviewText);
    setName('');
    setReviewText('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Your Review</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="review" className="block text-sm font-medium text-gray-700">Review</label>
          <textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit Review
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length > 0 ? (
        <div className="p-4 border border-gray-300 rounded-md">
          <p className="font-bold">{reviews[currentReviewIndex].name}</p>
          <p>{reviews[currentReviewIndex].review}</p>
          <div className="mt-4 flex justify-between">
            <button
              onClick={prevReview}
              disabled={currentReviewIndex === 0}
              className="bg-gray-300 py-2 px-4 rounded"
            >
              Previous
            </button>
            <button
              onClick={nextReview}
              disabled={currentReviewIndex === reviews.length - 1}
              className="bg-gray-300 py-2 px-4 rounded"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default Reviews;
