package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Contract;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends MongoRepository<Contract, String> {
    List<Contract> findByEvent_Id(String eventId);
    List<Contract> findByUser_Id(String userId);
}
