package com.hivemind.controller.response;

import lombok.Builder;

import java.util.Optional;

@Builder
public record LoginResponse(String publicKey, Optional<String> privateKey) {
}
