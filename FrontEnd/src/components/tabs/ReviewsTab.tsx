import React, { useMemo } from 'react';
import { ReviewForm } from '../ReviewForm';
import { ReviewsList } from '../ReviewsList';
export const ReviewsTab = ({ reviews, vendorId }: { reviews?: any[], vendorId?: string }) => {
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

  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ReviewForm vendorId={vendorId} />
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">What Others Are Saying</h2>
            <span className="text-purple-500">{reviewCount} Review{reviewCount !== 1 ? 's' : ''}</span>
          </div>
          <ReviewsList reviews={reviews} />
        </div>
      </div>
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg h-fit">
        <h3 className="text-xl font-bold mb-4">Overall Rating</h3>
        <div className="flex items-center justify-center mb-6">
          <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
        </div>
        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map(star => (
            <svg 
              key={star} 
              className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'}`} 
              fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mb-6">
          Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
        </p>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="flex items-center">
              <span className="w-12 text-sm">{rating} star</span>
              <div className="flex-1 mx-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{
                  width: `${ratingDistribution[index]}%`
                }}></div>
              </div>
              <span className="w-10 text-right text-sm">
                {ratingDistribution[index]}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>;
};