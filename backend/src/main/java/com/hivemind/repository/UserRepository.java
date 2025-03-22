package com.hivemind.repository;

import com.hivemind.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<UserDetails> findUserByEmail(String username);
    Optional<User> findByName(String name);

    boolean existsByEmail(String email);
    boolean existsByName(String name);
}
