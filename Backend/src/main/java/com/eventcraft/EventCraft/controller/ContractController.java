package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin(origins = "*") // Allow requests from React frontend
public class ContractController {

    @Autowired
    private ContractService contractService;

    @PostMapping
    public ResponseEntity<?> createContract(@RequestBody Map<String, Object> payload) {
        try {
            Contract.ContractBuilder builder = Contract.builder()
                    .contractText((String) payload.get("contractText"));
            
            // Set event if provided
            if (payload.get("eventId") != null) {
                // Event will be set by service
            }
            
            // Set vendor if provided
            if (payload.get("vendorId") != null) {
                // Vendor will be set by service
            }
            
            // Set contract details
            if (payload.get("clientName") != null) {
                builder.clientName((String) payload.get("clientName"));
            }
            if (payload.get("companyName") != null) {
                builder.companyName((String) payload.get("companyName"));
            }
            if (payload.get("contactEmail") != null) {
                builder.contactEmail((String) payload.get("contactEmail"));
            }
            if (payload.get("phoneNumber") != null) {
                builder.phoneNumber((String) payload.get("phoneNumber"));
            }
            if (payload.get("address") != null) {
                builder.address((String) payload.get("address"));
            }
            if (payload.get("totalFee") != null) {
                Object totalFeeObj = payload.get("totalFee");
                if (totalFeeObj instanceof Number) {
                    builder.totalFee(((Number) totalFeeObj).doubleValue());
                } else if (totalFeeObj instanceof String) {
                    builder.totalFee(Double.parseDouble((String) totalFeeObj));
                }
            }
            if (payload.get("depositAmount") != null) {
                Object depositObj = payload.get("depositAmount");
                if (depositObj instanceof Number) {
                    builder.depositAmount(((Number) depositObj).doubleValue());
                } else if (depositObj instanceof String) {
                    builder.depositAmount(Double.parseDouble((String) depositObj));
                }
            }
            if (payload.get("paymentDeadline") != null) {
                String deadlineStr = (String) payload.get("paymentDeadline");
                if (deadlineStr != null && !deadlineStr.isEmpty()) {
                    try {
                        // Parse ISO format datetime string
                        builder.paymentDeadline(java.time.LocalDateTime.parse(deadlineStr));
                    } catch (Exception e) {
                        // If parsing fails, try to parse as date only and set to end of day
                        try {
                            java.time.LocalDate date = java.time.LocalDate.parse(deadlineStr.substring(0, 10));
                            builder.paymentDeadline(date.atTime(23, 59, 59));
                        } catch (Exception ex) {
                            // Ignore if still fails
                        }
                    }
                }
            }
            if (payload.get("venue") != null) {
                builder.venue((String) payload.get("venue"));
            }

            Contract contract = builder.build();
            String userId = (String) payload.get("userId");
            Contract savedContract = contractService.saveContract(
                contract,
                userId,
                (String) payload.get("eventId"), 
                (String) payload.get("vendorId")
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Contract saved successfully",
                    "contractId", savedContract.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Error saving contract: " + e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllContracts() {
        try {
            List<Contract> contracts = contractService.getAllContracts();
            return ResponseEntity.ok(contracts);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Error fetching contracts: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getContractsByEvent(@PathVariable String eventId) {
        try {
            List<Contract> contracts = contractService.getContractsByEventId(eventId);
            return ResponseEntity.ok(contracts);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Error fetching contracts: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getContractsByUser(@PathVariable String userId) {
        try {
            List<Contract> contracts = contractService.getContractsByUserId(userId);
            return ResponseEntity.ok(contracts);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Error fetching contracts: " + e.getMessage()
            ));
        }
    }
}
