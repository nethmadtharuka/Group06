import React, { useState } from 'react';
import { reviewAPI } from '../services/api';
export const ReviewForm = ({ vendorId, onReviewSubmitted }: { vendorId?: string; onReviewSubmitted?: () => void }) => {
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
      
      // Call callback to refresh reviews
      if (onReviewSubmitted) {
        setTimeout(() => {
          onReviewSubmitted();
          setSubmitted(false);
        }, 1500);
      } else {
        // Fallback: reload page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit review. Please try again.';
      if (errorMessage.includes('already reviewed')) {
        alert('You have already reviewed this vendor. You can update your existing review.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <div className="bg-green-900/30 border border-green-700 p-6 rounded-lg">
      <p className="text-green-400">Thank you! Your review has been submitted.</p>
    </div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-30 p-6 rounded-lg vendor-review-form">
        <h2 
          className="text-xl font-bold mb-2 vendor-review-form-title"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Share Your Experience
        </h2>
        <p className="text-gray-400 mb-6 vendor-review-form-subtitle">
          Let others know about your experience with this vendor.
        </p>
        <div className="mb-6">
          <label className="block mb-2 text-white vendor-review-rating-label">Your Rating</label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRating(star);
                }}
                className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1 vendor-review-star-button"
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                <svg 
                  className={`w-10 h-10 cursor-pointer vendor-review-star ${star <= rating ? 'text-yellow-400' : 'text-gray-500'}`} 
                  fill={star <= rating ? "currentColor" : "none"}
                  stroke={star <= rating ? "currentColor" : "currentColor"}
                  strokeWidth={star <= rating ? 0 : 1}
                  viewBox="0 0 20 20"
                  style={{ pointerEvents: 'none' }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-gray-400 text-sm vendor-review-rating-text">
                {rating} star{rating !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-2 vendor-review-comment-label">Your Review</label>
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent vendor-review-textarea" 
            rows={4} 
            placeholder="What did you like or dislike? How was the service?"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={loading || !rating}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg font-medium flex items-center vendor-review-submit-button"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
            <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
      <style>{`
        .vendor-review-form {
          transition: all 0.3s ease;
        }
        .vendor-review-form:hover {
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }
        .vendor-review-form-title {
          transition: all 0.3s ease;
        }
        .vendor-review-form:hover .vendor-review-form-title {
          color: #a78bfa;
        }
        .vendor-review-form-subtitle {
          transition: all 0.3s ease;
        }
        .vendor-review-form:hover .vendor-review-form-subtitle {
          color: #c4b5fd;
        }
        .vendor-review-rating-label {
          transition: all 0.3s ease;
        }
        .vendor-review-form:hover .vendor-review-rating-label {
          color: #a78bfa;
        }
        .vendor-review-star-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .vendor-review-star-button:hover {
          transform: scale(1.2) rotate(10deg);
        }
        .vendor-review-star {
          transition: all 0.3s ease;
        }
        .vendor-review-star-button:hover .vendor-review-star {
          color: #fbbf24;
        }
        .vendor-review-rating-text {
          transition: all 0.3s ease;
        }
        .vendor-review-form:hover .vendor-review-rating-text {
          color: #c4b5fd;
        }
        .vendor-review-comment-label {
          transition: all 0.3s ease;
        }
        .vendor-review-form:hover .vendor-review-comment-label {
          color: #a78bfa;
        }
        .vendor-review-textarea {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .vendor-review-textarea:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
          border-color: rgba(139, 92, 246, 0.8);
        }
        .vendor-review-textarea:hover:not(:focus) {
          border-color: rgba(139, 92, 246, 0.5);
        }
        .vendor-review-submit-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .vendor-review-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .vendor-review-submit-button:hover::before {
          left: 100%;
        }
        .vendor-review-submit-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </>
  );
};