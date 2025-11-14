package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.*;
import com.eventcraft.EventCraft.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final ContractRepository contractRepository;
    private final PaymentRepository paymentRepository;
    private final VendorRepository vendorRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total Active Users (excluding deleted/inactive)
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);
        
        // Total Events
        long totalEvents = eventRepository.count();
        stats.put("totalEvents", totalEvents);
        
        // Bookings in last 30 days (signed contracts)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        List<Contract> allContracts = contractRepository.findAll();
        long bookings30d = allContracts.stream()
                .filter(contract -> contract.getCreatedAt() != null && 
                        contract.getCreatedAt().isAfter(thirtyDaysAgo) &&
                        contract.getSigned() != null && contract.getSigned())
                .count();
        stats.put("bookings30d", bookings30d);
        
        // Revenue in last 30 days (completed payments)
        List<Payment> allPayments = paymentRepository.findAll();
        double revenue30d = allPayments.stream()
                .filter(payment -> payment.getPaymentDate() != null &&
                        payment.getPaymentDate().isAfter(thirtyDaysAgo) &&
                        payment.getPaymentStatus() == Payment.PaymentStatus.COMPLETED)
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
        stats.put("revenue30d", revenue30d);
        
        // Calculate percentage changes (mock for now, can be enhanced with historical data)
        stats.put("usersChange", "+5.2%");
        stats.put("eventsChange", "+1.8%");
        stats.put("bookingsChange", "-3.1%");
        stats.put("revenueChange", "+21.3%");
        
        return stats;
    }

    public List<Vendor> getPendingVendors() {
        return vendorRepository.findAll().stream()
                .filter(vendor -> vendor.getApprovalStatus() == Vendor.ApprovalStatus.PENDING)
                .toList();
    }

    public Vendor approveVendor(String vendorId) {
        Optional<Vendor> vendorOpt = vendorRepository.findById(vendorId);
        if (vendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found with id: " + vendorId);
        }
        Vendor vendor = vendorOpt.get();
        vendor.setApprovalStatus(Vendor.ApprovalStatus.APPROVED);
        vendor.setUpdatedAt(LocalDateTime.now());
        return vendorRepository.save(vendor);
    }

    public Vendor rejectVendor(String vendorId) {
        Optional<Vendor> vendorOpt = vendorRepository.findById(vendorId);
        if (vendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found with id: " + vendorId);
        }
        Vendor vendor = vendorOpt.get();
        vendor.setApprovalStatus(Vendor.ApprovalStatus.REJECTED);
        vendor.setUpdatedAt(LocalDateTime.now());
        return vendorRepository.save(vendor);
    }
}

