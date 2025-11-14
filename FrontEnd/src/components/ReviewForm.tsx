import React, { useState } from 'react';
import { reviewAPI } from '../services/api';
export const ReviewForm = ({ vendorId }: { vendorId?: string }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId || !rating) {
      alert('Please select a rating');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to submit a review');
      return;
    }

    setLoading(true);
    try {
      await reviewAPI.createReview(userId, {
        vendorId,
        rating,
        comment: comment || undefined
      });
      setSubmitted(true);
      setRating(0);
      setComment('');
      // Reload page after 2 seconds to show new review
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      alert(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <div className="bg-green-900/30 border border-green-700 p-6 rounded-lg">
      <p className="text-green-400">Thank you! Your review has been submitted.</p>
    </div>;
  }

  return <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-30 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Share Your Experience</h2>
      <p className="text-gray-400 mb-6">
        Let others know about your experience with this vendor.
      </p>
      <div className="mb-6">
        <label className="block mb-2">Your Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => (
            <button 
              key={star} 
              type="button" 
              onClick={() => setRating(star)} 
              className="mr-1"
            >
              <svg 
                className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                fill={star <= rating ? "currentColor" : "none"}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="block mb-2">Your Review</label>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
          rows={4} 
          placeholder="What did you like or dislike? How was the service?"
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={loading || !rating}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg font-medium transition duration-200 flex items-center"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
          <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </form>;
};