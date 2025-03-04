package com.hivemind.controller;

import com.hivemind.configuration.TokenService;
import com.hivemind.controller.request.LoginRequest;
import com.hivemind.controller.request.UserRequest;
import com.hivemind.controller.response.LoginResponse;
import com.hivemind.controller.response.RegisterResponse;
import com.hivemind.entity.User;
import com.hivemind.exception.InvalidUsernameOrPasswordException;
import com.hivemind.mapper.AuthMapper;
import com.hivemind.mapper.UserMapper;
import com.hivemind.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody UserRequest request, HttpServletResponse response) {
        User savedUser = userService.save(UserMapper.toUser(request));
        String token = tokenService.generateToken(savedUser);

        ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", token)
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.status(HttpStatus.CREATED).body(AuthMapper.toRegisterResponse(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            UsernamePasswordAuthenticationToken userAndPass = new UsernamePasswordAuthenticationToken(request.email(), request.password());
            Authentication authentication = authenticationManager.authenticate(userAndPass);

            User user = (User) authentication.getPrincipal();
            String token = tokenService.generateToken(user);

            ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", token)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .sameSite("Lax")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(AuthMapper.toLoginResponse(user));
        } catch (BadCredentialsException exception) {
            throw new InvalidUsernameOrPasswordException("Invalid username or password.");
        }
    }
}
