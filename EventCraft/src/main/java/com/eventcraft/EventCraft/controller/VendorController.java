package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.VendorRegDTO;
import com.eventcraft.EventCraft.dto.VendorUpdateDTO;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
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

    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<Vendor> updateVendor(
            @PathVariable String userId,
            @RequestBody VendorUpdateDTO request) {
        Vendor updatedVendor = vendorService.updateVendor(userId, request);
        return ResponseEntity.ok(updatedVendor);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Vendor> getVendorByUserId(@PathVariable String userId) {
        Vendor vendor = vendorService.getVendorByUserId(userId);
        return ResponseEntity.ok(vendor);
    }

}
