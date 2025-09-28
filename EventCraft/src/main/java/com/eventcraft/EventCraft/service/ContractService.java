package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    public Contract saveContract(Contract contract) {
        return contractRepository.save(contract);
    }
}