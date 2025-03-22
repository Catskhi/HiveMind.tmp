package com.hivemind.controller;

import com.hivemind.configuration.JWTUserData;
import com.hivemind.controller.request.UserRequest;
import com.hivemind.controller.response.UserResponse;
import com.hivemind.entity.User;
import com.hivemind.mapper.UserMapper;
import com.hivemind.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponse> showDetails() {
        JWTUserData authentication = (JWTUserData) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return ResponseEntity.ok(UserMapper.toUserResponse(userService.findById(authentication.id())));
    }

    @PutMapping
    public ResponseEntity<UserResponse> update(@Valid @RequestBody UserRequest request) {
        JWTUserData authentication = (JWTUserData) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return userService.updateById(UserMapper.toUser(request), authentication.id())
                .map(user -> ResponseEntity.ok(UserMapper.toUserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping
    public ResponseEntity<String> delete() {
        JWTUserData authentication = (JWTUserData) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        userService.delete(authentication.id());
        return ResponseEntity.ok("User deleted");
    }
}
