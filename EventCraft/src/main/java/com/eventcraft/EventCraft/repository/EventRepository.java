package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    List<Event> findByUserId(String userId);

    List<Event> findByStatus(Event.Status status);

    List<Event> findByUserIdAndStartDateGreaterThanEqualOrderByStartDateAsc(String userId, LocalDate startDate);

    List<Event> findByUserIdAndStartDateBetweenOrderByStartDateAsc(String userId, LocalDate startDate, LocalDate endDate);
}
