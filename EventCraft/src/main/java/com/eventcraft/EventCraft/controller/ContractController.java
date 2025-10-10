package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contracts")
@CrossOrigin(origins = "*") // Allow requests from React frontend
public class ContractController {

    @Autowired
    private ContractService contractService;

    @PostMapping
    public ResponseEntity<?> createContract(@RequestBody Map<String, String> payload) {
        try {
            Contract contract = Contract.builder()
                    .contractText(payload.get("contractText"))
                    .build();

            Contract savedContract = contractService.saveContract(contract);

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
}
