package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @GetMapping
    public List<Contract> getAllContracts() {
        return contractService.getAllContracts();
    }

    @GetMapping("/{id}")
    public Optional<Contract> getContractById(@PathVariable String id) {
        return contractService.getContractById(id);
    }

    @PostMapping
    public Contract createContract(@RequestBody Contract contract) {
        return contractService.createContract(contract);
    }

    @DeleteMapping("/{id}")
    public void deleteContract(@PathVariable String id) {
        contractService.deleteContract(id);
    }
}
