package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.VendorRegDTO;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<Vendor> registerVendor(
            @PathVariable String userId,
            @RequestBody VendorRegDTO request) {
        Vendor vendor = vendorService.registerVendor(userId, request);
        return ResponseEntity.ok(vendor);
    }
}
