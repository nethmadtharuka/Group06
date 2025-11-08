package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Payment;
import com.eventcraft.EventCraft.entity.Contract;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByContract(Contract contract);
}
