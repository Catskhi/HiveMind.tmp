package com.hivemind.controller.response;

import lombok.Builder;

@Builder
public record RegisterResponse(Long id, String name, String email, String publicKey, String privateKey) {
}
