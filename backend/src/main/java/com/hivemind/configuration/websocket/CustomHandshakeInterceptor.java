package com.hivemind.configuration.websocket;

import com.hivemind.configuration.JWTUserData;
import com.hivemind.configuration.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomHandshakeInterceptor implements HandshakeInterceptor {

    private final TokenService tokenService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            HttpServletRequest servletRequest = ((ServletServerHttpRequest) request).getServletRequest();
            Cookie[] cookies = servletRequest.getCookies();
            if (cookies != null) {
                Optional<Cookie> tokenCookie = Arrays.stream(cookies)
                        .filter(cookie -> "JWT_TOKEN".equals(cookie.getName()))
                        .findFirst();
                if (tokenCookie.isPresent()) {
                    String token = tokenCookie.get().getValue();
                    Optional<JWTUserData> optJwtUserData = tokenService.verifyToken(token);
                    if (optJwtUserData.isPresent()) {
                        JWTUserData userData = optJwtUserData.get();
                        attributes.put("principal", new UsernamePasswordAuthenticationToken(userData.name(), null));
                    }
                }
            }
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}

