package com.hivemind.service;

import com.hivemind.entity.User;
import com.hivemind.exception.DuplicateEntryException;
import com.hivemind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User save(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateEntryException("This email already exists.");
        }
        if (userRepository.existsByName(user.getName())) {
            throw new DuplicateEntryException("This username already exists.");
        }
        String password = user.getPassword();
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }
}
