package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.ReviewDTO;
import com.eventcraft.EventCraft.entity.Review;
import com.eventcraft.EventCraft.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createReview(
            @PathVariable String userId,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        try {
            Review review = reviewService.createReview(userId, reviewDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{reviewId}/user/{userId}")
    public ResponseEntity<?> updateReview(
            @PathVariable String reviewId,
            @PathVariable String userId,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        try {
            Review review = reviewService.updateReview(reviewId, userId, reviewDTO);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{reviewId}/user/{userId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable String reviewId,
            @PathVariable String userId) {
        try {
            reviewService.deleteReview(reviewId, userId);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Review>> getReviewsByVendor(@PathVariable String vendorId) {
        List<Review> reviews = reviewService.getReviewsByVendor(vendorId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable String userId) {
        List<Review> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable String reviewId) {
        Optional<Review> review = reviewService.getReviewById(reviewId);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

