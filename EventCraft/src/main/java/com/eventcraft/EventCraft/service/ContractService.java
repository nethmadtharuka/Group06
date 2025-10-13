package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.ContractRequest;
import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.ContractRepository;
import com.eventcraft.EventCraft.repository.EventRepository;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final EventRepository eventRepository;

    public Contract createContract(String userId, ContractRequest contractRequest) {
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Find vendor
        Vendor vendor = vendorRepository.findById(contractRequest.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + contractRequest.getVendorId()));

        // Find event if provided
        Event event = null;
        if (contractRequest.getEventId() != null && !contractRequest.getEventId().isEmpty()) {
            event = eventRepository.findById(contractRequest.getEventId())
                    .orElse(null); // Event is optional
        }

        // Create contract
        Contract contract = Contract.builder()
                .user(user)
                .vendor(vendor)
                .event(event)
                .contractText(contractRequest.getContractText())
                .signed(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return contractRepository.save(contract);
    }

    public List<Contract> getContractsByUserId(String userId) {
        return contractRepository.findByUserId(userId);
    }

    public List<Contract> getContractsByVendorId(String vendorId) {
        return contractRepository.findByVendorId(vendorId);
    }

    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    public Optional<Contract> getContractById(String contractId) {
        return contractRepository.findById(contractId);
    }

    public Contract updateContractStatus(String contractId, Boolean signed) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found with id: " + contractId));

        contract.setSigned(signed);
        contract.setUpdatedAt(LocalDateTime.now());
        
        if (signed) {
            contract.setSignedAt(LocalDateTime.now());
        }

        return contractRepository.save(contract);
    }

    public void deleteContract(String contractId) {
        contractRepository.deleteById(contractId);
    }

    public List<Contract> getSignedContracts() {
        return contractRepository.findBySigned(true);
    }

    public List<Contract> getUnsignedContracts() {
        return contractRepository.findBySigned(false);
    }
}