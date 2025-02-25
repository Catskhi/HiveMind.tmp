package com.hivemind.controller;

import com.hivemind.configuration.TokenService;
import com.hivemind.controller.request.LoginRequest;
import com.hivemind.controller.request.UserRequest;
import com.hivemind.controller.response.LoginResponse;
import com.hivemind.controller.response.UserResponse;
import com.hivemind.entity.User;
import com.hivemind.exception.InvalidUsernameOrPasswordException;
import com.hivemind.mapper.LoginMapper;
import com.hivemind.mapper.UserMapper;
import com.hivemind.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @GetMapping("/verify")
    public ResponseEntity<String> verifyLogin() {
        return ResponseEntity.ok("Authenticated");
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRequest request) {
        User savedUser = userService.save(UserMapper.toUser(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(UserMapper.toRegisterResponse(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            UsernamePasswordAuthenticationToken userAndPass = new UsernamePasswordAuthenticationToken(request.email(), request.password());
            Authentication authentication = authenticationManager.authenticate(userAndPass);

            User user = (User) authentication.getPrincipal();
            String token = tokenService.generateToken(user);

            return ResponseEntity.ok(LoginMapper.toLoginResponse(token, user));
        } catch (BadCredentialsException exception) {
            throw new InvalidUsernameOrPasswordException("Invalid username or password.");
        }
    }
    @PutMapping("/user/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        User updatedUser = UserMapper.toUser(request);

        return userService.updateById(updatedUser, id)
                .map(user -> ResponseEntity.ok(UserMapper.toUserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }
}
