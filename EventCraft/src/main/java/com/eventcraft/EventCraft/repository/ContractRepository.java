package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Contract;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends MongoRepository<Contract, String> {
    // Custom queries can be added here if needed
}
