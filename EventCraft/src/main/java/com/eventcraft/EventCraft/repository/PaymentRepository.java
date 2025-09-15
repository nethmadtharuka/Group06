package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Payment;
import com.eventcraft.EventCraft.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByContract(Contract contract);
}
