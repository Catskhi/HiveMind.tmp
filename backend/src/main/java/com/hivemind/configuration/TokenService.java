package com.hivemind.configuration;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.hivemind.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Optional;

@Component
public class TokenService {

    @Value("${hivemind.security.secret}")
    private String secret;

    public String generateToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(secret);

        return JWT.create()
                .withSubject(user.getEmail())
                .withClaim("id", user.getId())
                .withClaim("name", user.getName())
                .withExpiresAt(Instant.now().plusSeconds(86400))
                .withIssuedAt(Instant.now())
                .withIssuer("API HiveMind")
                .sign(algorithm);
    }

    public ResponseCookie createJwtCookie(String token, boolean isProduction) {
        return ResponseCookie.from("JWT_TOKEN", token)
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .secure(isProduction)
                .build();
    }

    public Optional<JWTUserData> verifyToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            DecodedJWT jwt = JWT.require(algorithm)
                    .build()
                    .verify(token);

            return Optional.of(JWTUserData.builder()
                            .id(jwt.getClaim("id").asLong())
                            .name(jwt.getClaim("name").asString())
                            .email(jwt.getSubject())
                            .build());
        } catch (JWTVerificationException exception) {
            return Optional.empty();
        }
    }
}
