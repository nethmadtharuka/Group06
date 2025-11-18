package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/vendors/pending")
    public ResponseEntity<List<Vendor>> getPendingVendors() {
        List<Vendor> pendingVendors = adminService.getPendingVendors();
        return ResponseEntity.ok(pendingVendors);
    }

    @PutMapping("/vendors/{vendorId}/approve")
    public ResponseEntity<?> approveVendor(@PathVariable String vendorId) {
        try {
            Vendor vendor = adminService.approveVendor(vendorId);
            return ResponseEntity.ok(vendor);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/vendors/{vendorId}/reject")
    public ResponseEntity<?> rejectVendor(@PathVariable String vendorId) {
        try {
            Vendor vendor = adminService.rejectVendor(vendorId);
            return ResponseEntity.ok(vendor);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/support/chats")
    public ResponseEntity<List<com.eventcraft.EventCraft.entity.Chat>> getSupportChats() {
        List<com.eventcraft.EventCraft.entity.Chat> chats = adminService.getSupportChats();
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/vendors/best")
    public ResponseEntity<List<Map<String, Object>>> getBestVendors() {
        List<Map<String, Object>> bestVendors = adminService.getBestVendors();
        return ResponseEntity.ok(bestVendors);
    }

    @GetMapping("/reports/growth")
    public ResponseEntity<Map<String, Object>> getGrowthReport() {
        Map<String, Object> report = adminService.getGrowthReport();
        return ResponseEntity.ok(report);
    }
}
