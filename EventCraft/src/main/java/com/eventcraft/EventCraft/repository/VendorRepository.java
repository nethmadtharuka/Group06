package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Integer> {

    Optional<Vendor> findByUserId(Integer userId);

}
