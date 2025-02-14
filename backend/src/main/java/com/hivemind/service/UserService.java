package com.hivemind.service;

import com.auth0.jwt.algorithms.Algorithm;
import com.hivemind.entity.User;
import com.hivemind.exception.DuplicateEntryException;
import com.hivemind.exception.UserNotFoundException;
import com.hivemind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

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
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            KeyPair keyPair = generator.generateKeyPair();
            String publicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
            String privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());
            user.setPublicKey(publicKey);
            user.setTempPrivateKey(privateKey);
        } catch (NoSuchAlgorithmException exception) {
            throw new RuntimeException("No such RSA generation algorithm.");
        }
        String password = user.getPassword();
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
    }

    public Optional<User> updateById(User updatedUser, Long id) {
        Optional<User> userToUpdate = userRepository.findById(id);
        if (userToUpdate.isPresent()) {
            User user = userToUpdate.get();
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            userRepository.save(user);
            return Optional.of(user);
        } else {
            return Optional.empty();
        }
    }

    public void delete(Long id) {
        Optional<User> user = Optional.ofNullable(userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found.")));
        if (user.isPresent()) {
            userRepository.deleteById(id);
        }
    }
}
