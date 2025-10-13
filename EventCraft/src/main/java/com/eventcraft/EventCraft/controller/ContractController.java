package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.ContractRequest;
import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.service.ContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ContractController {

    private final ContractService contractService;

    // Create new contract
    @PostMapping("/create")
    public ResponseEntity<?> createContract(@RequestHeader("X-User-ID") String userId, 
                                          @Valid @RequestBody ContractRequest contractRequest) {
        try {
            log.info("Creating contract for user: {} with vendor: {}", userId, contractRequest.getVendorId());
            Contract contract = contractService.createContract(userId, contractRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Contract created successfully");
            response.put("contractId", contract.getId());
            response.put("contract", contract);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating contract", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create contract: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get contracts by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getContractsByUser(@PathVariable String userId) {
        try {
            List<Contract> contracts = contractService.getContractsByUserId(userId);
            return ResponseEntity.ok(contracts);
        } catch (Exception e) {
            log.error("Error fetching contracts for user: {}", userId, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch contracts: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get contracts by vendor
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<?> getContractsByVendor(@PathVariable String vendorId) {
        try {
            List<Contract> contracts = contractService.getContractsByVendorId(vendorId);
            return ResponseEntity.ok(contracts);
        } catch (Exception e) {
            log.error("Error fetching contracts for vendor: {}", vendorId, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch contracts: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get all contracts
    @GetMapping
    public ResponseEntity<?> getAllContracts() {
        try {
            List<Contract> contracts = contractService.getAllContracts();
            return ResponseEntity.ok(contracts);
        } catch (Exception e) {
            log.error("Error fetching all contracts", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching contracts: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get contract by ID
    @GetMapping("/{contractId}")
    public ResponseEntity<?> getContractById(@PathVariable String contractId) {
        try {
            return contractService.getContractById(contractId)
                    .map(contract -> ResponseEntity.ok(contract))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching contract: {}", contractId, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch contract: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Update contract status (sign/unsign)
    @PutMapping("/{contractId}/status")
    public ResponseEntity<?> updateContractStatus(@PathVariable String contractId,
                                                @RequestBody Map<String, Boolean> request) {
        try {
            Boolean signed = request.get("signed");
            Contract updatedContract = contractService.updateContractStatus(contractId, signed);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Contract status updated successfully");
            response.put("contract", updatedContract);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating contract status: {}", contractId, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update contract status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Delete contract
    @DeleteMapping("/{contractId}")
    public ResponseEntity<?> deleteContract(@PathVariable String contractId) {
        try {
            contractService.deleteContract(contractId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Contract deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting contract: {}", contractId, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete contract: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Legacy endpoint for backward compatibility
    @PostMapping
    public ResponseEntity<?> createContractLegacy(@RequestBody Map<String, String> payload) {
        try {
            Contract contract = Contract.builder()
                    .contractText(payload.get("contractText"))
                    .build();

            Contract savedContract = contractService.getAllContracts().stream()
                    .findFirst()
                    .orElse(null);

            return ResponseEntity.ok(Map.of(
                    "message", "Contract saved successfully",
                    "contractId", savedContract != null ? savedContract.getId() : "unknown"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Error saving contract: " + e.getMessage()
            ));
        }
    }
}
