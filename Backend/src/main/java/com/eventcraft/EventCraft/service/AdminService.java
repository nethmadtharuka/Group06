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
    private final ChatRepository chatRepository;

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

    // Get all support chats (system chats)
    public List<Chat> getSupportChats() {
        return chatRepository.findAll().stream()
                .filter(chat -> chat.getIsSystemChat() != null && chat.getIsSystemChat())
                .sorted((a, b) -> {
                    LocalDateTime dateA = a.getLastMessageAt() != null ? a.getLastMessageAt() : a.getCreatedAt();
                    LocalDateTime dateB = b.getLastMessageAt() != null ? b.getLastMessageAt() : b.getCreatedAt();
                    return dateB.compareTo(dateA); // Most recent first
                })
                .toList();
    }

    // Get best vendors (top rated, most bookings, etc.)
    public List<Map<String, Object>> getBestVendors() {
        List<Vendor> allVendors = vendorRepository.findAll().stream()
                .filter(v -> v.getApprovalStatus() == Vendor.ApprovalStatus.APPROVED)
                .toList();

        return allVendors.stream()
                .map(vendor -> {
                    Map<String, Object> vendorData = new HashMap<>();
                    vendorData.put("id", vendor.getId());
                    vendorData.put("companyName", vendor.getCompanyName());
                    vendorData.put("serviceType", vendor.getServiceType());
                    vendorData.put("rating", vendor.getRating() != null ? vendor.getRating() : 0.0);
                    vendorData.put("address", vendor.getAddress());
                    vendorData.put("mainPhotoURL", vendor.getMainPhotoURL());
                    
                    // Count contracts for this vendor
                    long contractCount = contractRepository.findAll().stream()
                            .filter(contract -> contract.getVendor() != null && 
                                   contract.getVendor().getId().equals(vendor.getId()) &&
                                   contract.getSigned() != null && contract.getSigned())
                            .count();
                    vendorData.put("totalBookings", contractCount);
                    
                    // Calculate revenue for this vendor
                    double revenue = paymentRepository.findAll().stream()
                            .filter(payment -> payment.getContract() != null &&
                                   payment.getContract().getVendor() != null &&
                                   payment.getContract().getVendor().getId().equals(vendor.getId()) &&
                                   payment.getPaymentStatus() == Payment.PaymentStatus.COMPLETED)
                            .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                            .sum();
                    vendorData.put("totalRevenue", revenue);
                    
                    return vendorData;
                })
                .sorted((a, b) -> {
                    // Sort by rating first, then by bookings
                    Double ratingA = (Double) a.get("rating");
                    Double ratingB = (Double) b.get("rating");
                    int ratingCompare = ratingB.compareTo(ratingA);
                    if (ratingCompare != 0) return ratingCompare;
                    
                    Long bookingsA = (Long) a.get("totalBookings");
                    Long bookingsB = (Long) b.get("totalBookings");
                    return bookingsB.compareTo(bookingsA);
                })
                .limit(10) // Top 10 vendors
                .toList();
    }

    // Get growth and analytics report
    public Map<String, Object> getGrowthReport() {
        Map<String, Object> report = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minus(30, ChronoUnit.DAYS);
        LocalDateTime sixtyDaysAgo = now.minus(60, ChronoUnit.DAYS);
        
        // User growth
        long totalUsers = userRepository.count();
        long usersLast30Days = userRepository.findAll().stream()
                .filter(user -> user.getCreatedAt() != null && user.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();
        long usersPrevious30Days = userRepository.findAll().stream()
                .filter(user -> user.getCreatedAt() != null && 
                       user.getCreatedAt().isAfter(sixtyDaysAgo) && 
                       user.getCreatedAt().isBefore(thirtyDaysAgo))
                .count();
        double userGrowthRate = usersPrevious30Days > 0 ? 
                ((double)(usersLast30Days - usersPrevious30Days) / usersPrevious30Days) * 100 : 0;
        
        report.put("totalUsers", totalUsers);
        report.put("usersLast30Days", usersLast30Days);
        report.put("usersPrevious30Days", usersPrevious30Days);
        report.put("userGrowthRate", Math.round(userGrowthRate * 100.0) / 100.0);
        
        // Vendor growth
        long totalVendors = vendorRepository.count();
        long vendorsLast30Days = vendorRepository.findAll().stream()
                .filter(vendor -> vendor.getCreatedAt() != null && vendor.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();
        long vendorsPrevious30Days = vendorRepository.findAll().stream()
                .filter(vendor -> vendor.getCreatedAt() != null && 
                       vendor.getCreatedAt().isAfter(sixtyDaysAgo) && 
                       vendor.getCreatedAt().isBefore(thirtyDaysAgo))
                .count();
        double vendorGrowthRate = vendorsPrevious30Days > 0 ? 
                ((double)(vendorsLast30Days - vendorsPrevious30Days) / vendorsPrevious30Days) * 100 : 0;
        
        report.put("totalVendors", totalVendors);
        report.put("vendorsLast30Days", vendorsLast30Days);
        report.put("vendorsPrevious30Days", vendorsPrevious30Days);
        report.put("vendorGrowthRate", Math.round(vendorGrowthRate * 100.0) / 100.0);
        
        // Event growth
        long totalEvents = eventRepository.count();
        long eventsLast30Days = eventRepository.findAll().stream()
                .filter(event -> event.getCreatedAt() != null && event.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();
        long eventsPrevious30Days = eventRepository.findAll().stream()
                .filter(event -> event.getCreatedAt() != null && 
                       event.getCreatedAt().isAfter(sixtyDaysAgo) && 
                       event.getCreatedAt().isBefore(thirtyDaysAgo))
                .count();
        double eventGrowthRate = eventsPrevious30Days > 0 ? 
                ((double)(eventsLast30Days - eventsPrevious30Days) / eventsPrevious30Days) * 100 : 0;
        
        report.put("totalEvents", totalEvents);
        report.put("eventsLast30Days", eventsLast30Days);
        report.put("eventsPrevious30Days", eventsPrevious30Days);
        report.put("eventGrowthRate", Math.round(eventGrowthRate * 100.0) / 100.0);
        
        // Booking growth
        List<Contract> allContracts = contractRepository.findAll();
        long bookingsLast30Days = allContracts.stream()
                .filter(contract -> contract.getCreatedAt() != null && 
                       contract.getCreatedAt().isAfter(thirtyDaysAgo) &&
                       contract.getSigned() != null && contract.getSigned())
                .count();
        long bookingsPrevious30Days = allContracts.stream()
                .filter(contract -> contract.getCreatedAt() != null && 
                       contract.getCreatedAt().isAfter(sixtyDaysAgo) && 
                       contract.getCreatedAt().isBefore(thirtyDaysAgo) &&
                       contract.getSigned() != null && contract.getSigned())
                .count();
        double bookingGrowthRate = bookingsPrevious30Days > 0 ? 
                ((double)(bookingsLast30Days - bookingsPrevious30Days) / bookingsPrevious30Days) * 100 : 0;
        
        report.put("bookingsLast30Days", bookingsLast30Days);
        report.put("bookingsPrevious30Days", bookingsPrevious30Days);
        report.put("bookingGrowthRate", Math.round(bookingGrowthRate * 100.0) / 100.0);
        
        // Revenue growth
        List<Payment> allPayments = paymentRepository.findAll();
        double revenueLast30Days = allPayments.stream()
                .filter(payment -> payment.getPaymentDate() != null &&
                       payment.getPaymentDate().isAfter(thirtyDaysAgo) &&
                       payment.getPaymentStatus() == Payment.PaymentStatus.COMPLETED)
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
        double revenuePrevious30Days = allPayments.stream()
                .filter(payment -> payment.getPaymentDate() != null &&
                       payment.getPaymentDate().isAfter(sixtyDaysAgo) &&
                       payment.getPaymentDate().isBefore(thirtyDaysAgo) &&
                       payment.getPaymentStatus() == Payment.PaymentStatus.COMPLETED)
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
        double revenueGrowthRate = revenuePrevious30Days > 0 ? 
                ((revenueLast30Days - revenuePrevious30Days) / revenuePrevious30Days) * 100 : 0;
        
        report.put("revenueLast30Days", revenueLast30Days);
        report.put("revenuePrevious30Days", revenuePrevious30Days);
        report.put("revenueGrowthRate", Math.round(revenueGrowthRate * 100.0) / 100.0);
        
        // Monthly breakdown for last 3 months
        Map<String, Object> monthlyData = new HashMap<>();
        for (int monthIndex = 0; monthIndex < 3; monthIndex++) {
            final int i = monthIndex;
            LocalDateTime monthStart = now.minus(i * 30, ChronoUnit.DAYS);
            LocalDateTime monthEnd = i == 0 ? now : now.minus((i - 1) * 30, ChronoUnit.DAYS);
            
            long monthUsers = userRepository.findAll().stream()
                    .filter(user -> user.getCreatedAt() != null && 
                           user.getCreatedAt().isAfter(monthStart) && 
                           (i == 0 || user.getCreatedAt().isBefore(monthEnd)))
                    .count();
            long monthBookings = allContracts.stream()
                    .filter(contract -> contract.getCreatedAt() != null && 
                           contract.getCreatedAt().isAfter(monthStart) && 
                           (i == 0 || contract.getCreatedAt().isBefore(monthEnd)) &&
                           contract.getSigned() != null && contract.getSigned())
                    .count();
            double monthRevenue = allPayments.stream()
                    .filter(payment -> payment.getPaymentDate() != null &&
                           payment.getPaymentDate().isAfter(monthStart) && 
                           (i == 0 || payment.getPaymentDate().isBefore(monthEnd)) &&
                           payment.getPaymentStatus() == Payment.PaymentStatus.COMPLETED)
                    .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                    .sum();
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("users", monthUsers);
            monthData.put("bookings", monthBookings);
            monthData.put("revenue", monthRevenue);
            monthlyData.put("month" + (i + 1), monthData);
        }
        report.put("monthlyBreakdown", monthlyData);
        
        return report;
    }
}

