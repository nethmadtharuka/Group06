package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends MongoRepository<Contract, String> {
    
    List<Contract> findByUser(User user);
    
    List<Contract> findByUserId(String userId);
    
    List<Contract> findByVendor(Vendor vendor);
    
    List<Contract> findByVendorId(String vendorId);
    
    List<Contract> findBySigned(Boolean signed);
}
