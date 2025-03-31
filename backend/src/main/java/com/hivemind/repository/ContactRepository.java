package com.hivemind.repository;

import com.hivemind.entity.Contact;
import com.hivemind.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    Optional<Contact> findByUserAndContact(User user, User contact);
    List<Contact> findByUserIdOrderByLastMessageAtDesc(Long userId);
}
