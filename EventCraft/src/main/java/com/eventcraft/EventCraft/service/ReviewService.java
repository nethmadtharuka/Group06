package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.ReviewDTO;
import com.eventcraft.EventCraft.entity.Review;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.ReviewRepository;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    public Review createReview(String userId, ReviewDTO reviewDTO) {
        // Find user and vendor
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Vendor vendor = vendorRepository.findById(reviewDTO.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + reviewDTO.getVendorId()));

        // Check if user has already reviewed this vendor
        if (reviewRepository.existsByVendor_IdAndUser_Id(reviewDTO.getVendorId(), userId)) {
            throw new RuntimeException("User has already reviewed this vendor");
        }

        // Create review
        Review review = Review.builder()
                .vendor(vendor)
                .user(user)
                .rating(reviewDTO.getRating())
                .comment(reviewDTO.getComment())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update vendor rating
        updateVendorRating(reviewDTO.getVendorId());

        return savedReview;
    }

    public Review updateReview(String reviewId, String userId, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        // Verify that the review belongs to the user
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("User is not authorized to update this review");
        }

        // Update review
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);

        // Update vendor rating
        updateVendorRating(review.getVendor().getId());

        return savedReview;
    }

    public void deleteReview(String reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        // Verify that the review belongs to the user
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("User is not authorized to delete this review");
        }

        String vendorId = review.getVendor().getId();
        reviewRepository.delete(review);

        // Update vendor rating
        updateVendorRating(vendorId);
    }

    public List<Review> getReviewsByVendor(String vendorId) {
        return reviewRepository.findByVendor_Id(vendorId);
    }

    public List<Review> getReviewsByUser(String userId) {
        return reviewRepository.findByUser_Id(userId);
    }

    public Optional<Review> getReviewById(String reviewId) {
        return reviewRepository.findById(reviewId);
    }

    private void updateVendorRating(String vendorId) {
        List<Review> reviews = reviewRepository.findByVendor_Id(vendorId);
        if (reviews.isEmpty()) {
            return;
        }

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
        vendor.setRating(averageRating);
        vendor.setUpdatedAt(LocalDateTime.now());
        vendorRepository.save(vendor);
    }
}

