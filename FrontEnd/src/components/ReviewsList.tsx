import React from 'react';
export const ReviewsList = ({ reviews }: { reviews?: any[] }) => {
  if (!reviews || reviews.length === 0) {
    return <div className="text-center py-12">
      <p className="text-gray-400 text-lg">No reviews yet. Be the first to review!</p>
    </div>;
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <>
      <div className="space-y-8">
        {reviews.map((review: any) => {
          const userName = review.user?.fullName || review.user?.username || 'Anonymous';
          const userInitial = userName.charAt(0).toUpperCase();
          
          return (
            <div key={review.id} className="pb-8 border-b border-gray-800 vendor-review-item">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 vendor-review-avatar">
                  {userInitial}
                </div>
                <div className="vendor-review-user-info">
                  <h4 className="font-medium vendor-review-username">{userName}</h4>
                  <p className="text-sm text-gray-400 vendor-review-date">{formatDate(review.createdAt || review.timestamp)}</p>
                </div>
                <div className="ml-auto flex vendor-review-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg 
                      key={star} 
                      className={`w-4 h-4 vendor-review-star-icon ${star <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}`} 
                      fill={star <= (review.rating || 0) ? "currentColor" : "none"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-300 vendor-review-comment">{review.comment}</p>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        .vendor-review-item {
          transition: all 0.3s ease;
        }
        .vendor-review-item:hover {
          transform: translateX(4px);
          border-color: rgba(139, 92, 246, 0.3);
        }
        .vendor-review-avatar {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .vendor-review-item:hover .vendor-review-avatar {
          transform: scale(1.15) rotate(5deg);
          background: rgba(139, 92, 246, 0.3);
        }
        .vendor-review-username {
          transition: all 0.3s ease;
        }
        .vendor-review-item:hover .vendor-review-username {
          color: #a78bfa;
        }
        .vendor-review-date {
          transition: all 0.3s ease;
        }
        .vendor-review-item:hover .vendor-review-date {
          color: #c4b5fd;
        }
        .vendor-review-star-icon {
          transition: all 0.3s ease;
        }
        .vendor-review-item:hover .vendor-review-star-icon {
          transform: scale(1.1);
        }
        .vendor-review-comment {
          transition: all 0.3s ease;
        }
        .vendor-review-item:hover .vendor-review-comment {
          color: #c4b5fd;
        }
      `}</style>
    </>
  );
};