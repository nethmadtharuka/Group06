package com.eventcraft.EventCraft.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "payments")
public class Payment {

    @Id
    private String id; // MongoDB ObjectId as String

    @DBRef
    private Contract contract; // reference to Contract document

    private Double amount;

    private PaymentMethod paymentMethod;

    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();

    public enum PaymentMethod { CARD, BANK_TRANSFER, PAYPAL }

    public enum PaymentStatus { PENDING, COMPLETED, FAILED }
}
