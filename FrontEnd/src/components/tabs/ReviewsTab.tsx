import React, { useMemo, useState, useEffect } from 'react';
import { ReviewForm } from '../ReviewForm';
import { ReviewsList } from '../ReviewsList';
import { reviewAPI, vendorAPI } from '../../services/api';
export const ReviewsTab = ({ reviews: initialReviews, vendorId }: { reviews?: any[], vendorId?: string }) => {
  const [reviews, setReviews] = useState<any[]>(initialReviews || []);
  const [loading, setLoading] = useState(false);
  const [userReview, setUserReview] = useState<any>(null);

  useEffect(() => {
    setReviews(initialReviews || []);
    
    // Check if current user has already reviewed
    const userId = localStorage.getItem('userId');
    if (userId && initialReviews) {
      const existingReview = initialReviews.find((r: any) => r.user?.id === userId);
      setUserReview(existingReview || null);
    }
  }, [initialReviews]);

  const refreshReviews = async () => {
    if (!vendorId) return;
    
    setLoading(true);
    try {
      const updatedReviews = await reviewAPI.getReviewsByVendor(vendorId);
      setReviews(updatedReviews || []);
      
      // Check if user has reviewed
      const userId = localStorage.getItem('userId');
      if (userId && updatedReviews) {
        const existingReview = updatedReviews.find((r: any) => r.user?.id === userId);
        setUserReview(existingReview || null);
      }
      
      // Also refresh vendor details to get updated rating
      if (vendorId) {
        const vendorData = await vendorAPI.getVendorDetails(vendorId);
        // Trigger parent component to update if needed
        window.dispatchEvent(new CustomEvent('vendorUpdated', { detail: vendorData }));
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const reviewCount = reviews?.length || 0;
  
  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return [0, 0, 0, 0, 0];
    }
    const distribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
    reviews.forEach(review => {
      const rating = Math.round(review.rating || 0);
      if (rating >= 1 && rating <= 5) {
        distribution[5 - rating]++;
      }
    });
    return distribution.map(count => Math.round((count / reviews.length) * 100));
  }, [reviews]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {!userReview ? (
            <ReviewForm vendorId={vendorId} onReviewSubmitted={refreshReviews} />
          ) : (
            <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-lg vendor-user-review-card">
              <p className="text-blue-400 mb-2 vendor-user-review-message">You have already reviewed this vendor.</p>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg vendor-user-review-content">
                <div className="flex items-center mb-2">
                  <div className="flex vendor-user-review-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg 
                        key={star} 
                        className={`w-5 h-5 vendor-user-review-star ${star <= (userReview.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}`} 
                        fill={star <= (userReview.rating || 0) ? "currentColor" : "none"}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-white font-medium vendor-user-review-rating">Your Rating: {userReview.rating}/5</span>
                </div>
                {userReview.comment && (
                  <p className="text-gray-300 mt-2 vendor-user-review-comment">{userReview.comment}</p>
                )}
              </div>
            </div>
          )}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-2xl font-bold vendor-reviews-title"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                What Others Are Saying
              </h2>
              <span className="text-purple-500 vendor-reviews-count">{reviewCount} Review{reviewCount !== 1 ? 's' : ''}</span>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Refreshing reviews...</div>
            ) : (
              <ReviewsList reviews={reviews} />
            )}
          </div>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg h-fit vendor-rating-card">
          <h3 className="text-xl font-bold mb-4 vendor-rating-card-title">Overall Rating</h3>
          <div className="flex items-center justify-center mb-6">
            <span className="text-5xl font-bold vendor-rating-average">{averageRating.toFixed(1)}</span>
          </div>
          <div className="flex justify-center mb-6 vendor-rating-stars">
            {[1, 2, 3, 4, 5].map(star => (
              <svg 
                key={star} 
                className={`w-6 h-6 vendor-rating-star ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'}`} 
                fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mb-6 vendor-rating-based">
            Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </p>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center vendor-rating-bar-item">
                <span className="w-12 text-sm vendor-rating-bar-label">{rating} star</span>
                <div className="flex-1 mx-3 h-2 bg-gray-700 rounded-full overflow-hidden vendor-rating-bar-container">
                  <div className="h-full bg-purple-500 rounded-full vendor-rating-bar" style={{
                    width: `${ratingDistribution[index]}%`
                  }}></div>
                </div>
                <span className="w-10 text-right text-sm vendor-rating-bar-percent">
                  {ratingDistribution[index]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .vendor-user-review-card {
          transition: all 0.3s ease;
        }
        .vendor-user-review-card:hover {
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
        }
        .vendor-user-review-message {
          transition: all 0.3s ease;
        }
        .vendor-user-review-card:hover .vendor-user-review-message {
          color: #60a5fa;
        }
        .vendor-user-review-star {
          transition: all 0.3s ease;
        }
        .vendor-user-review-card:hover .vendor-user-review-star {
          transform: scale(1.1);
        }
        .vendor-user-review-rating {
          transition: all 0.3s ease;
        }
        .vendor-user-review-card:hover .vendor-user-review-rating {
          color: #a78bfa;
        }
        .vendor-user-review-comment {
          transition: all 0.3s ease;
        }
        .vendor-user-review-card:hover .vendor-user-review-comment {
          color: #c4b5fd;
        }
        .vendor-reviews-title {
          transition: all 0.3s ease;
        }
        .vendor-reviews-title:hover {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .vendor-reviews-count {
          transition: all 0.3s ease;
        }
        .vendor-reviews-count:hover {
          transform: scale(1.1);
        }
        .vendor-rating-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .vendor-rating-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1);
        }
        .vendor-rating-card-title {
          transition: all 0.3s ease;
        }
        .vendor-rating-card:hover .vendor-rating-card-title {
          color: #a78bfa;
        }
        .vendor-rating-average {
          transition: all 0.3s ease;
        }
        .vendor-rating-card:hover .vendor-rating-average {
          transform: scale(1.1);
          color: #a78bfa;
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .vendor-rating-star {
          transition: all 0.3s ease;
        }
        .vendor-rating-card:hover .vendor-rating-star {
          transform: scale(1.1);
        }
        .vendor-rating-based {
          transition: all 0.3s ease;
        }
        .vendor-rating-card:hover .vendor-rating-based {
          color: #c4b5fd;
        }
        .vendor-rating-bar-item {
          transition: all 0.3s ease;
        }
        .vendor-rating-card:hover .vendor-rating-bar-item {
          transform: translateX(4px);
        }
        .vendor-rating-bar-label {
          transition: all 0.3s ease;
        }
        .vendor-rating-card:hover .vendor-rating-bar-label {
          color: #a78bfa;
        }
        .vendor-rating-bar {
          transition: all 0.3s ease;
        }
        .vendor-rating-card:hover .vendor-rating-bar {
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
        }
        .vendor-rating-bar-percent {
          transition: all 0.3s ease;
        }
        .vendor-rating-card:hover .vendor-rating-bar-percent {
          color: #c4b5fd;
        }
      `}</style>
    </>
  );
};