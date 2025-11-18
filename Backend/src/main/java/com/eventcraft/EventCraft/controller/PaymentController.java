package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.Payment;
import com.eventcraft.EventCraft.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> payload) {
        try {
            String contractId = (String) payload.get("contractId");
            Object amountObj = payload.get("amount");
            String paymentMethodStr = (String) payload.get("paymentMethod");

            if (contractId == null || amountObj == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Missing required fields",
                        "message", "contractId and amount are required"
                ));
            }

            Double amount;
            if (amountObj instanceof Number) {
                amount = ((Number) amountObj).doubleValue();
            } else if (amountObj instanceof String) {
                amount = Double.parseDouble((String) amountObj);
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Invalid amount format"
                ));
            }

            Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.CARD;
            if (paymentMethodStr != null) {
                try {
                    paymentMethod = Payment.PaymentMethod.valueOf(paymentMethodStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Default to CARD if invalid
                }
            }

            Payment payment = paymentService.createPayment(contractId, amount, paymentMethod);

            return ResponseEntity.ok(Map.of(
                    "message", "Payment created successfully",
                    "paymentId", payment.getId(),
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error creating payment",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<Payment>> getPaymentsByContract(@PathVariable String contractId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByContract(contractId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String paymentId) {
        return paymentService.getPaymentById(paymentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

