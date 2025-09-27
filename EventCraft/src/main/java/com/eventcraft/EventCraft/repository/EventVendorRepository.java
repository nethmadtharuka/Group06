package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.EventVendor;
import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventVendorRepository extends MongoRepository<EventVendor, String> {

    List<EventVendor> findByEvent(Event event);

    List<EventVendor> findByVendor(Vendor vendor);

    Optional<EventVendor> findByEventAndVendor(Event event, Vendor vendor);
}
