package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.entity.Payment;
import com.eventcraft.EventCraft.repository.ContractRepository;
import com.eventcraft.EventCraft.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ContractRepository contractRepository;

    public Payment createPayment(String contractId, Double amount, Payment.PaymentMethod paymentMethod) {
        Optional<Contract> contractOpt = contractRepository.findById(contractId);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + contractId);
        }

        Payment payment = Payment.builder()
                .contract(contractOpt.get())
                .amount(amount)
                .paymentMethod(paymentMethod)
                .paymentStatus(Payment.PaymentStatus.COMPLETED)
                .build();

        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByContract(String contractId) {
        Optional<Contract> contractOpt = contractRepository.findById(contractId);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + contractId);
        }
        return paymentRepository.findByContract(contractOpt.get());
    }

    public Optional<Payment> getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId);
    }
}

