package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    List<Event> findByUser(User user);

    List<Event> findByStatus(Event.Status status);
}
