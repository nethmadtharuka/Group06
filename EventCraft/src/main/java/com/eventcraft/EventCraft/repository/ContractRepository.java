package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {

    List<Contract> findByEvent(Event event);

    List<Contract> findByVendor(Vendor vendor);
}
