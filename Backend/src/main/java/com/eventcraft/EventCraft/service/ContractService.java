package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.ContractRepository;
import com.eventcraft.EventCraft.repository.EventRepository;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private VendorRepository vendorRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Contract saveContract(Contract contract) {
        return contractRepository.save(contract);
    }
    
    public Contract saveContract(Contract contract, String eventId, String vendorId) {
        if (eventId != null && !eventId.isEmpty()) {
            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isPresent()) {
                contract.setEvent(eventOpt.get());
                // If user is not set, get it from the event
                if (contract.getUser() == null && eventOpt.get().getUser() != null) {
                    contract.setUser(eventOpt.get().getUser());
                }
            }
        }
        
        if (vendorId != null && !vendorId.isEmpty()) {
            Optional<Vendor> vendorOpt = vendorRepository.findById(vendorId);
            if (vendorOpt.isPresent()) {
                contract.setVendor(vendorOpt.get());
            }
        }
        
        return contractRepository.save(contract);
    }

    public Contract saveContract(Contract contract, String userId, String eventId, String vendorId) {
        // Set user if provided
        if (userId != null && !userId.isEmpty()) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                contract.setUser(userOpt.get());
            }
        }
        
        // Set event if provided
        if (eventId != null && !eventId.isEmpty()) {
            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isPresent()) {
                contract.setEvent(eventOpt.get());
                // If user is not set, get it from the event
                if (contract.getUser() == null && eventOpt.get().getUser() != null) {
                    contract.setUser(eventOpt.get().getUser());
                }
            }
        }
        
        // Set vendor if provided
        if (vendorId != null && !vendorId.isEmpty()) {
            Optional<Vendor> vendorOpt = vendorRepository.findById(vendorId);
            if (vendorOpt.isPresent()) {
                contract.setVendor(vendorOpt.get());
            }
        }
        
        return contractRepository.save(contract);
    }

    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    public List<Contract> getContractsByEventId(String eventId) {
        List<Contract> contracts = contractRepository.findByEvent_Id(eventId);
        // Remove duplicates based on contract ID
        return contracts.stream()
                .filter(contract -> contract.getId() != null)
                .collect(java.util.stream.Collectors.toMap(
                    Contract::getId,
                    contract -> contract,
                    (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Contract> getContractsByUserId(String userId) {
        return contractRepository.findByUser_Id(userId);
    }
}